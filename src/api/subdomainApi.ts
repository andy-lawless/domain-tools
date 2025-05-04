import axios from "axios";

const BASE_URL = "https://crt.sh/";

export const fetchSubdomains = async (domain: string): Promise<string[]> => {
  try {
    const response = await axios.get(`${BASE_URL}?q=%.${domain}&output=json&exclude=expired`, {
      headers: {
        "User-Agent": "SubdomainFinder/1.0 (contact: your-email@example.com)",
      },
    });

    // Extract subdomains from name_value, split by newline, and deduplicate
    const subdomains = new Set<string>();
    response.data.forEach((cert: any) => {
      const names = cert.name_value.split("\n");
      names.forEach((name: string) => {
        if (name.endsWith(`.${domain}`) || name === domain) {
          subdomains.add(name);
        }
      });
    });

    return Array.from(subdomains).sort();
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch subdomains from crt.sh. Please try again later."
    );
  }
};