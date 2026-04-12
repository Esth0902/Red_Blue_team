var whitelist = ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:3001']

module.exports = corsOptions = {
  origin: function (origin, callback) {
    // Pour ne pas "leaker" l'IP sur GitHub, on accepte temporairement toutes les origines
    // ou on pourrait rajouter l'IP du VPS dynamique depuis les variables d'environnement.
    let corsOption = {origin: true}
    callback(null, corsOption)
  }
}