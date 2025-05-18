<?php include '/domain-tools/includes/header.php'; ?>
<?php include '/domain-tools/includes/navbar.php'; ?>

<div class="container">
  <p>Enter a domain to find its associated subdomains:</p>
  <form id="domain-form">
    <input type="text" id="domain-input" placeholder="example.com" required>
    <button type="submit">Search</button>
  </form>
  <div id="results"></div>
</div>

<?php include '/domain-tools/includes/footer.php'; ?>