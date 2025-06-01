
import pandas as pd
import requests
from tqdm import tqdm

# Load your CSV
df = pd.read_csv(r"D:\Projects\solar-sphere-connect\src\database\solar_contacts.csv")


# Function to check if a website is valid
def is_website_valid(url):
    try:
        response = requests.head(url, allow_redirects=True, timeout=5)
        return response.status_code == 200
    except requests.RequestException:
        return False

# Add a progress bar
tqdm.pandas(desc="Checking websites")
df["website_valid"] = df["website"].progress_apply(is_website_valid)

# Save results to a new CSV
df.to_csv("solar_contacts_with_validity.csv", index=False)
print("Done. Results saved to 'solar_contacts_with_validity.csv'")
