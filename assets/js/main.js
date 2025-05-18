document.getElementById('domain-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const domain = document.getElementById('domain-input').value;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch(`/domain-tools/api/crtsh.php?domain=${domain}`);
    const data = await response.json();

    if (data.error) {
      resultsDiv.innerHTML = `<p>Error: ${data.error}</p>`;
    } else {
      const subdomains = data.subdomains;
      if (subdomains.length === 0) {
        resultsDiv.innerHTML = '<p>No subdomains found.</p>';
      } else {
        resultsDiv.innerHTML = '<ul>' + subdomains.map(sub => `<li>${sub}</li>`).join('') + '</ul>';
      }
    }
  } catch (error) {
    resultsDiv.innerHTML = `<p>Error fetching subdomains.</p>`;
  }
});