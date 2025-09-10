import requests
import json
import os
import csv
import time
from datetime import datetime
import pandas as pd

def fetch_eia_data():
    # Direct CSV download URL for state electricity profiles
    # This URL was obtained from the EIA's bulk data download page
    CSV_URL = "https://www.eia.gov/electricity/state/xls/sep_all.xlsx"
    
    try:
        # Download the Excel file
        response = requests.get(CSV_URL)
        response.raise_for_status()
        
        # Save the Excel file temporarily
        os.makedirs("data/eia", exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        excel_path = os.path.join("data/eia", f"eia_data_{timestamp}.xlsx")
        csv_path = os.path.join("data/eia", f"eia_data_{timestamp}.csv")
        
        with open(excel_path, "wb") as f:
            f.write(response.content)
        
        print(f"Excel file downloaded to {excel_path}")
        
        # Convert Excel to CSV
        # Read the Excel file - we assume the first sheet has the data
        # Specify engine='openpyxl' for .xlsx files
        df = pd.read_excel(excel_path, sheet_name=0, engine='openpyxl')
        
        # Save as CSV
        df.to_csv(csv_path, index=False)
        print(f"Converted to CSV at {csv_path}")
        
        # Read CSV data into a dictionary
        with open(csv_path, 'r') as f:
            reader = csv.DictReader(f)
            data = list(reader)
        
        return {
            "status": "success",
            "data": data,
            "file_path": csv_path
        }
        
    except Exception as e:
        print(f"Error downloading or converting data: {e}")
        return None

def save_data(data):
    # This function is no longer needed as we're saving in fetch_eia_data
    return data["file_path"]

if __name__ == "__main__":
    data = fetch_eia_data()
    if data:
        save_data(data)
    else:
        print("No data received from API")
