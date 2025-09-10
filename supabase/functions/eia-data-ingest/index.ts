import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

interface GenerationResponse {
  response: {
    data: {
      period: string;
      "value-units": string;
      "generation-type": string;
      region: string;
      value: number;
    }[];
  };
}

interface RetailSalesResponse {
  response: {
    data: Array<{
      period: string;
      stateid: string;
      stateDescription: string;
      sectorid: string;
      sectorName: string;
      customers: number;
      price: number;
      revenue: number;
      sales: number;
      "customers-units": string;
      "price-units": string;
      "revenue-units": string;
      "sales-units": string;
    }>;
  };
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req: Request) => {
  try {
    const EIA_API_KEY = Deno.env.get('EIA_API_KEY');
    if (!EIA_API_KEY) throw new Error('EIA_API_KEY environment variable not set');
    
    // Fetch electricity generation data
    const genUrl = `https://api.eia.gov/v2/electricity/rto/region-data/data/?api_key=${EIA_API_KEY}&frequency=monthly&data[0]=value&facets[type][]=D&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000`;
    const genResponse = await fetch(genUrl);
    if (!genResponse.ok) {
      throw new Error(`Generation API request failed: ${genResponse.status}`);
    }
    const genData: GenerationResponse = await genResponse.json();
    const genRecords = genData.response.data;
    
    // Transform and insert generation data
    const genInsertData = genRecords.map(record => ({
      region: record.region,
      period: new Date(record.period).toISOString(),
      generation_type: record["generation-type"],
      value: record.value,
      unit: record["value-units"]
    }));
    
    // Fetch retail sales data
    const retailUrl = `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=${EIA_API_KEY}&frequency=monthly&data[]=customers&data[]=price&data[]=revenue&data[]=sales&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000`;
    const retailResponse = await fetch(retailUrl);
    if (!retailResponse.ok) {
      throw new Error(`Retail sales API request failed: ${retailResponse.status}`);
    }
    const retailData: RetailSalesResponse = await retailResponse.json();
    const retailRecords = retailData.response.data;
    
    // Transform and insert retail sales data
    const retailInsertData = retailRecords.map(record => ({
      period: record.period,
      stateid: record.stateid,
      stateDescription: record.stateDescription,
      sectorid: record.sectorid,
      sectorName: record.sectorName,
      customers: record.customers,
      price: record.price,
      revenue: record.revenue,
      sales: record.sales,
      customers_units: record["customers-units"],
      price_units: record["price-units"],
      revenue_units: record["revenue-units"],
      sales_units: record["sales-units"]
    }));
    
    // Delete existing data before inserting new data
    await supabase.from("eia_generation_data").delete().neq('id', 0);
    await supabase.from("eia_retail_sales").delete().neq('id', 0);
    
    // Insert new data
    const { error: genError } = await supabase
      .from("eia_generation_data")
      .insert(genInsertData);
    
    if (genError) throw genError;
    
    const { error: retailError } = await supabase
      .from("eia_retail_sales")
      .insert(retailInsertData);
    
    if (retailError) throw retailError;
    
    return new Response(
      JSON.stringify({ 
        message: "Data ingested successfully", 
        generationCount: genInsertData.length,
        retailCount: retailInsertData.length
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
