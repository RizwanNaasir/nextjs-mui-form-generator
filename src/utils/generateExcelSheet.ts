import { writeFile, utils } from 'xlsx';
const { sheet_add_json } = utils;
import { saveAs } from 'file-saver';

export function generateExcelSheet(formValues) {
    const worksheet = sheet_add_json({}, formValues, { header: ['Question', ...formValues.map(field => field.label)] });
    const workbook = {
        Sheets: { 'Sheet1': worksheet },
        SheetNames: ['Sheet1'],
    };
    const excelBuffer = writeFile(workbook, 'form_responses.xlsx',{ type: 'buffer', bookType: 'xlsx' });
    saveAs(new Blob([excelBuffer]), 'form_responses.xlsx');
}
