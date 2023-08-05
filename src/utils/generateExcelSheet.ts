import {utils, writeFile} from 'xlsx';
import {FormBlueprint} from "@/models/form";

const {sheet_add_aoa} = utils;

export function generateExcelSheet(formBlueprint: FormBlueprint) {
    const questions = formBlueprint.fields.map((field) => field.label);
    const responses = formBlueprint.responses.map((response, index) => {
        const rowData = questions.map((question) => response[question.replace(/\s+/g, "-").toLowerCase()] || "");
        rowData.unshift(index + 1); // Adding index as the first column
        return rowData;
    });

    const headerRow = ["Sr#", ...questions];
    const data = [headerRow, ...responses];

    const worksheet = sheet_add_aoa({}, data, {origin: -1});
    const workbook = {
        Sheets: {'Sheet1': worksheet},
        SheetNames: ['Sheet1'],
    };

    writeFile(workbook, 'form_responses.xlsx', {type: 'buffer', bookType: 'xlsx'});
}
