import json
import os
import plotly.graph_objects as go
from plotly.subplots import make_subplots

def load_latest_data():
    data_dir = "data/eia"
    files = [f for f in os.listdir(data_dir) if f.endswith(".json")]
    if not files:
        return None
    
    latest_file = max(files, key=lambda x: os.path.getmtime(os.path.join(data_dir, x)))
    with open(os.path.join(data_dir, latest_file), "r") as f:
        return json.load(f)

def create_dashboard(data):
    if not data or "response" not in data or "data" not in data["response"]:
        print("Invalid or empty data structure")
        return None

    # Extract relevant data
    states = []
    avg_retail_prices = []
    avg_price_ranks = []
    capacity_ranks = []
    
    for item in data["response"]["data"]:
        # Extract state ID - use different keys based on API response
        state = item.get("stateID") or item.get("stateid") or item.get("state")
        states.append(state)
        
        # Extract values safely with defaults
        avg_retail_prices.append(item.get("average-retail-price", item.get("average_retail_price", 0)))
        avg_price_ranks.append(item.get("average-retail-price-rank", item.get("average_retail_price_rank", 0)))
        capacity_ranks.append(item.get("capacity-elect-utilities-rank", item.get("capacity_elect_utilities_rank", 0)))

    # Create dashboard
    fig = make_subplots(rows=2, cols=1, subplot_titles=("Average Retail Price by State", "Utility Rankings"))

    # Price chart
    fig.add_trace(
        go.Bar(x=states, y=avg_retail_prices, name="Average Price", marker_color='blue'),
        row=1, col=1
    )

    # Rankings chart
    fig.add_trace(
        go.Scatter(x=states, y=avg_price_ranks, name="Price Rank", mode='lines+markers', line=dict(color='red')),
        row=2, col=1
    )
    fig.add_trace(
        go.Scatter(x=states, y=capacity_ranks, name="Capacity Rank", mode='lines+markers', line=dict(color='green')),
        row=2, col=1
    )

    # Update layout
    fig.update_layout(
        height=900,
        title_text="EIA State Electricity Profile Analysis",
        showlegend=True
    )
    fig.update_yaxes(title_text="Cents/kWh", row=1, col=1)
    fig.update_yaxes(title_text="Rank (Lower is Better)", row=2, col=1)

    return fig

if __name__ == "__main__":
    eia_data = load_latest_data()
    if eia_data:
        dashboard = create_dashboard(eia_data)
        if dashboard:
            dashboard.show()
        else:
            print("Failed to create dashboard")
    else:
        print("No EIA data files found. Run fetch_eia_data.py first.")
