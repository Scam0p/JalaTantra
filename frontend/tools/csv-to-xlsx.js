// Simple CSV -> XLSX converter using the 'xlsx' package
// Usage: node tools/csv-to-xlsx.js [inputCsvPath] [outputXlsxPath]

const fs = require('fs')
const path = require('path')

async function main() {
  const args = process.argv.slice(2)
  const input = args[0] || path.join(__dirname, '..', 'demo_submissions.csv')
  const output = args[1] || path.join(__dirname, '..', 'demo_submissions.xlsx')

  if (!fs.existsSync(input)) {
    console.error('Input CSV not found:', input)
    process.exit(2)
  }

  let xlsx
  try {
    xlsx = require('xlsx')
  } catch (e) {
    console.error("Please install the 'xlsx' package first: npm install xlsx --save")
    process.exit(3)
  }

  try {
    const csv = fs.readFileSync(input, 'utf8')
    const wb = xlsx.utils.book_new()
    const ws = xlsx.utils.aoa_to_sheet(
      csv.split('\n').filter(Boolean).map(line => {
        // naive CSV parse: split on comma, handle quoted fields
        const row = []
        let cur = ''
        let inQuotes = false
        for (let i = 0; i < line.length; i++) {
          const ch = line[i]
          if (ch === '"') {
            inQuotes = !inQuotes
            continue
          }
          if (ch === ',' && !inQuotes) {
            row.push(cur)
            cur = ''
            continue
          }
          cur += ch
        }
        row.push(cur)
        return row
      })
    )
    xlsx.utils.book_append_sheet(wb, ws, 'submissions')
    xlsx.writeFile(wb, output)
    console.log('Wrote XLSX to', output)
    process.exit(0)
  } catch (e) {
    console.error('Failed to convert CSV to XLSX:', e)
    process.exit(1)
  }
}

main()
