const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (req,res) => {

    const url = req.body.url;

    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath:
            process.env.NODE_ENV === 'production'
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    }
    );
    try {

        // Create a new page with the default browser context 
        const page = await browser.newPage();

        // Go to the target website 
        await page.goto(url);

        // Inject jQuery into the page
        await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.6.0.min.js' });

        // Extract data using jQuery
        const filteredData = await page.evaluate(() => {
            // Extract data from elements with specified classes
            const englishData = $('.englishcontainer').text().trim();
            const arabicData = $('.arabic_hadith_full').text().trim();
            let grade;
            let commentator;
            let gradeArabic;
            let commentatorArabic;
            
            
            const reference = $('.hadith_reference').text().trim();


            const splitEnglishData = englishData.split(':');

            const narrattor = splitEnglishData[0].trim();
            const narration = splitEnglishData[1].trim();

            const englishGrade = $('.english_grade').text()?.trim();
            console.log("test: " + englishGrade);
            if (englishGrade !== null && englishGrade !== undefined) {
            const match = englishGrade.match(/Grade:\s*([^()]+)\s*\(([^)]+)\)/);

           

                if (match) {
                    grade = match[1]?.trim();
                    commentator = match[2]?.trim()
                } else {
                    // If no match found, use the original string as the grade
                    grade = englishGrade;
                }
            }

            const arabicGrade = $('.arabic_grade').text()?.trim();
            if (arabicGrade !== null && arabicGrade !== undefined) {
            const trimmedArabicGrade = arabicGrade.replace(/\u062d\u0643\u0645\s*:/, '').trim();
            const matchArabic = trimmedArabicGrade.match(/^([^()]+)\s*\(([^)]+)\)$/);

           

            if (matchArabic) {
                gradeArabic = matchArabic[1].trim();
                commentatorArabic = matchArabic[2].trim();
            } else {
                // If no match found, assume the whole string is the grade
                gradeArabic = trimmedArabicGrade.trim();
                commentator = "";
            }
        }


            // Split the text into an array based on "In-book reference" and "English translation"
            const parts = reference.split(/In-book reference\s*:\s*|English translation\s*:/);

            // Trim each part to remove leading and trailing whitespace
            const references = parts[0].trim().replace(/^Reference\s*:\s*/, ''); // Remove "Reference :" prefix
            const inBookReference = parts[1].trim();

            // Construct and return an object with filtered data
            return {
                narrattor,
                narration,
                arabicData,
                grade,
                commentator,
                gradeArabic,
                commentatorArabic,
                references,
                inBookReference
            };
        });

        // Send the filtered data back in the response
        res.json(filteredData);

    } catch (error) {
        console.error(error);

    } finally {
        await browser.close();
    }



}

module.exports = { scrapeLogic };