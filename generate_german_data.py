import requests, json

def fetch_all_pokemon():
    url = "https://pokeapi.co/api/v2/pokemon-species?limit=2000"
    r = requests.get(url)
    r.raise_for_status()
    species = r.json()["results"]
    datapoints = []

    for i, s in enumerate(species, start=1):
        detail = requests.get(s["url"]).json()
        name_de = next((n["name"] for n in detail["names"] if n["language"]["name"] == "de"), None)
        if not name_de:
            name_de = detail["name"]
        datapoints.append({"number": i, "name": name_de})

    with open("pokemon-deutsch-full.json", "w", encoding="utf-8") as f:
        json.dump(datapoints, f, ensure_ascii=False, indent=2)
    print("Fertig: pokemon-deutsch-full.json mit", len(datapoints), "Einträgen erstellt")

if __name__ == "__main__":
    fetch_all_pokemon()
