import {utils, writeFile} from 'xlsx';

const {sheet_add_aoa} = utils;

export function generateExcelSheet(formValues) {
    console.log(formValues);

    const questions = Object.keys(formValues);
    const responses = Object.values(formValues);

    const data = [questions, responses];

    const worksheet = sheet_add_aoa({}, data, {origin: -1});
    const workbook = {
        Sheets: {'Sheet1': worksheet},
        SheetNames: ['Sheet1'],
    };

    writeFile(workbook, 'form_responses.xlsx', {type: 'buffer', bookType: 'xlsx'});
}
