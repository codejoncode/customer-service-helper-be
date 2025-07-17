import app from "./app";


// ---- Start Server ----
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})

