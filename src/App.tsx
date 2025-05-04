import { useState } from "react";
import { useAppStore } from "@/store";
import { fetchSubdomains } from "@/api/subdomainApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function App() {
  const { domain, setDomain, subdomains, setSubdomains, loading, setLoading, error, setError } =
    useAppStore();
  const [inputValue, setInputValue] = useState("");

  const isValidDomain = (domain: string) => {
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    return regex.test(domain);
  };

  const handleSearch = async () => {
    if (!inputValue || !isValidDomain(inputValue.trim())) {
      setError("Please enter a valid domain (e.g., example.com)");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await fetchSubdomains(inputValue.trim());
      setDomain(inputValue.trim());
      setSubdomains(results);
    } catch (error: any) {
      setError(error.message || "An error occurred while fetching subdomains from crt.sh");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setDomain("");
    setSubdomains([]);
    setError(null);
  };

  const handleExport = () => {
    if (subdomains.length === 0) return;
    const csvContent = ["Subdomain", ...subdomains].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${domain}-subdomains.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Subdomain Finder</h1>
        <p className="text-sm text-gray-500 text-center mb-4">
        </p>
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-3 mb-6">
          <Input
            type="text"
            placeholder="Enter apex domain (e.g., example.com)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 text-base max-w-[320px] w-full mx-auto sm:mx-0"
            disabled={loading}
            aria-label="Domain input"
          />
          <p className="gap">
          </p>
          <div className="flex gap-2 justify-center sm:justify-start mt-6 sm:mt-0">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="px-6"
              aria-label="Search for subdomains"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Searching...
                </span>
              ) : (
                "Search"
              )}
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              disabled={loading}
              className="px-6"
              aria-label="Clear search"
            >
              Clear
            </Button>
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center" aria-live="polite">
            {error}
          </p>
        )}
        {loading && (
          <p className="text-gray-500 text-center">Loading subdomains from crt.sh...</p>
        )}
        {subdomains.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Subdomain</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subdomains.map((subdomain, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-left">{subdomain}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-center">
              <Button
                onClick={handleExport}
                disabled={!subdomains.length}
                className="px-6"
                aria-label="Export subdomains to CSV"
              >
                Export to CSV
              </Button>
            </div>
          </div>
        ) : (
          !loading &&
          domain && (
            <p className="text-gray-500 text-center">No subdomains found for {domain}</p>
          )
        )}
      </div>
    </div>
  );
}

export default App;