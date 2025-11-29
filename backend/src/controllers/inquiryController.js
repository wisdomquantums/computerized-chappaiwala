import ExcelJS from 'exceljs'
import PDFDocument from 'pdfkit'
import { Inquiry } from '../models/index.js'

const COMPANY_NAME = process.env.COMPANY_NAME?.trim() || 'Computerized Chhappai Wala'
const REPORT_TITLE = 'Inquiry Form Data'

const sanitize = (value) => (typeof value === 'string' ? value.trim() : '')

const buildInquiryPayload = (body = {}) => ({
    name: sanitize(body.name),
    email: sanitize(body.email),
    phone: sanitize(body.phone),
    service: sanitize(body.service),
    description: sanitize(body.description),
    sourcePage: sanitize(body.sourcePage) || null,
    metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : null,
})

export const createInquiry = async (req, res) => {
    try {
        const payload = buildInquiryPayload(req.body)
        if (!payload.name || !payload.email || !payload.phone || !payload.description) {
            return res.status(400).json({ message: 'Name, email, phone, and description are required.' })
        }

        const saved = await Inquiry.create(payload)
        return res.status(201).json({ inquiry: saved })
    } catch (error) {
        console.error('[inquiry] Failed to store submission', error) // eslint-disable-line no-console
        return res.status(500).json({ message: 'Unable to save inquiry right now.' })
    }
}

export const listInquiries = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200)
        const offset = (page - 1) * limit

        const { rows, count } = await Inquiry.findAndCountAll({
            order: [['createdAt', 'DESC']],
            offset,
            limit,
        })

        return res.json({
            data: rows,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit) || 1,
            },
        })
    } catch (error) {
        console.error('[inquiry] Failed to fetch submissions', error) // eslint-disable-line no-console
        return res.status(500).json({ message: 'Unable to load inquiries.' })
    }
}

const formatDate = (value) => {
    if (!value) return ''
    return new Date(value).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    })
}

export const exportInquiriesExcel = async (req, res) => {
    try {
        const entries = await Inquiry.findAll({ order: [['createdAt', 'DESC']] })
        const workbook = new ExcelJS.Workbook()
        workbook.creator = COMPANY_NAME
        workbook.created = new Date()
        const worksheet = workbook.addWorksheet('Inquiries', {
            properties: { tabColor: { argb: 'FF0EA5E9' } },
            views: [{ state: 'frozen', ySplit: 5 }],
        })

        const columns = [
            { header: '#', key: 'index', width: 6 },
            { header: 'Submitted', key: 'createdAt', width: 22 },
            { header: 'Name', key: 'name', width: 22 },
            { header: 'Email', key: 'email', width: 28 },
            { header: 'Phone', key: 'phone', width: 16 },
            { header: 'Service', key: 'service', width: 20 },
            { header: 'Description', key: 'description', width: 60 },
            { header: 'Source Page', key: 'sourcePage', width: 20 },
            { header: 'Status', key: 'status', width: 14 },
        ]

        worksheet.columns = columns

        const headlineRow = worksheet.addRow([COMPANY_NAME])
        worksheet.mergeCells(`A${headlineRow.number}:I${headlineRow.number}`)
        headlineRow.font = { size: 18, bold: true, color: { argb: 'FFFFFFFF' } }
        headlineRow.alignment = { horizontal: 'center', vertical: 'middle' }
        headlineRow.height = 28
        headlineRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0F172A' },
        }

        const subHeadlineRow = worksheet.addRow([REPORT_TITLE])
        worksheet.mergeCells(`A${subHeadlineRow.number}:I${subHeadlineRow.number}`)
        subHeadlineRow.font = { size: 12, bold: true, color: { argb: 'FF475569' } }
        subHeadlineRow.alignment = { horizontal: 'center' }
        subHeadlineRow.height = 20

        worksheet.addRow([''])

        const tableHeaderRow = worksheet.addRow(columns.map((column) => column.header))
        tableHeaderRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FF0F172A' } }
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFEFF6FF' },
            }
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFCBD5F5' } },
                left: { style: 'thin', color: { argb: 'FFCBD5F5' } },
                bottom: { style: 'thin', color: { argb: 'FFCBD5F5' } },
                right: { style: 'thin', color: { argb: 'FFCBD5F5' } },
            }
        })

        entries.forEach((entry, index) => {
            const row = worksheet.addRow({
                index: index + 1,
                createdAt: formatDate(entry.createdAt),
                name: entry.name,
                email: entry.email,
                phone: entry.phone,
                service: entry.service || 'Not specified',
                description: entry.description,
                sourcePage: entry.sourcePage,
                status: entry.status || 'New',
            })

            row.eachCell((cell) => {
                cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true }
                cell.border = {
                    top: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                    left: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                    bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                    right: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                }
            })

            if (index % 2 === 1) {
                row.eachCell((cell) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF8FAFC' },
                    }
                })
            }
        })

        const summaryRow = worksheet.addRow([
            `Total inquiries exported: ${entries.length}`,
        ])
        worksheet.mergeCells(`A${summaryRow.number}:I${summaryRow.number}`)
        summaryRow.font = { italic: true, color: { argb: 'FF475569' } }
        summaryRow.alignment = { horizontal: 'left' }

        const timestamp = new Date().toISOString().split('T')[0]
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', `attachment; filename="inquiries-${timestamp}.xlsx"`)
        await workbook.xlsx.write(res)
        res.end()
    } catch (error) {
        console.error('[inquiry] Failed to export Excel', error) // eslint-disable-line no-console
        res.status(500).json({ message: 'Unable to export inquiries to Excel right now.' })
    }
}

export const exportInquiriesPdf = async (req, res) => {
    try {
        const entries = await Inquiry.findAll({ order: [['createdAt', 'DESC']] })
        const doc = new PDFDocument({ margin: 40, size: 'A4' })
        const timestamp = new Date().toISOString().split('T')[0]

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="inquiries-${timestamp}.pdf"`)

        doc.pipe(res)
        doc.font('Helvetica-Bold').fontSize(18).fillColor('#0f172a').text(COMPANY_NAME, {
            align: 'center',
        })
        doc.moveDown(0.2)
        doc.font('Helvetica').fontSize(12).fillColor('#475569').text(REPORT_TITLE, {
            align: 'center',
        })
        doc.moveDown(1)

        const tableColumns = [
            { key: 'index', label: '#', width: 25 },
            { key: 'createdAt', label: 'Submitted', width: 80 },
            { key: 'name', label: 'Customer', width: 110 },
            { key: 'service', label: 'Service', width: 70 },
            { key: 'description', label: 'Message', width: 150 },
            { key: 'contact', label: 'Contact', width: 80 },
        ]

        const tableStartX = doc.page.margins.left
        const tableWidth = tableColumns.reduce((acc, column) => acc + column.width, 0)
        const rowPadding = 6

        const drawTableHeader = () => {
            const headerTop = doc.y
            const headerHeight = 24
            doc.save()
            doc.rect(tableStartX, headerTop, tableWidth, headerHeight).fill('#0f172a')
            doc.restore()

            let cursorX = tableStartX
            tableColumns.forEach((column) => {
                doc
                    .fillColor('#ffffff')
                    .font('Helvetica-Bold')
                    .fontSize(9)
                    .text(column.label, cursorX + 4, headerTop + 7, {
                        width: column.width - 8,
                    })
                cursorX += column.width
            })

            const headerBottom = headerTop + headerHeight
            doc
                .moveTo(tableStartX, headerBottom)
                .lineTo(tableStartX + tableWidth, headerBottom)
                .strokeColor('#0f172a')
                .lineWidth(0.5)
                .stroke()
            doc.y = headerBottom
        }

        const ensureSpaceForRow = (rowHeight) => {
            if (doc.y + rowHeight + rowPadding > doc.page.height - doc.page.margins.bottom) {
                doc.addPage()
                doc.font('Helvetica-Bold').fontSize(18).fillColor('#0f172a').text(COMPANY_NAME, {
                    align: 'center',
                })
                doc.moveDown(0.2)
                doc.font('Helvetica').fontSize(12).fillColor('#475569').text(REPORT_TITLE, {
                    align: 'center',
                })
                doc.moveDown(1)
                drawTableHeader()
            }
        }

        const drawRow = (values, rowIndex) => {
            const measuredHeights = tableColumns.map((column) =>
                doc.heightOfString(values[column.key] || '', {
                    width: column.width - 8,
                    align: 'left',
                })
            )
            const rowHeight = Math.max(...measuredHeights) + rowPadding * 2
            ensureSpaceForRow(rowHeight)
            const rowTop = doc.y

            const isStriped = rowIndex % 2 === 1
            if (isStriped) {
                doc.save()
                doc.rect(tableStartX, rowTop, tableWidth, rowHeight).fill('#f8fafc')
                doc.restore()
            }

            let cursorX = tableStartX
            tableColumns.forEach((column) => {
                doc
                    .lineWidth(0.25)
                    .strokeColor('#e2e8f0')
                    .rect(cursorX, rowTop, column.width, rowHeight)
                    .stroke()

                doc
                    .font('Helvetica')
                    .fontSize(9)
                    .fillColor('#0f172a')
                    .text(values[column.key] || '', cursorX + 4, rowTop + rowPadding, {
                        width: column.width - 8,
                        align: 'left',
                    })

                cursorX += column.width
            })
            doc.y = rowTop + rowHeight
        }

        drawTableHeader()

        if (!entries.length) {
            drawRow(
                {
                    index: '-',
                    createdAt: '—',
                    name: 'No submissions captured yet',
                    service: '',
                    description: '',
                    contact: '',
                },
                0
            )
        } else {
            entries.forEach((entry, idx) => {
                drawRow(
                    {
                        index: String(idx + 1),
                        createdAt: formatDate(entry.createdAt),
                        name: entry.name || 'Unknown',
                        service: entry.service || 'Not specified',
                        description: entry.description || '—',
                        contact: [entry.phone, entry.email].filter(Boolean).join('\n'),
                    },
                    idx
                )
            })
        }

        doc.moveDown(1)
        doc
            .font('Helvetica-Oblique')
            .fontSize(9)
            .fillColor('#475569')
            .text(`Export generated on ${formatDate(new Date())} | Total inquiries: ${entries.length}`, {
                align: 'left',
            })

        doc.end()
    } catch (error) {
        console.error('[inquiry] Failed to export PDF', error) // eslint-disable-line no-console
        res.status(500).json({ message: 'Unable to export inquiries to PDF right now.' })
    }
}
