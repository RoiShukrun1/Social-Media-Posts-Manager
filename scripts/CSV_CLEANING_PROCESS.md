# CSV Data Cleaning Script

The clean_csv.py script cleans the corrupted social media posts CSV data and outputs a clean version.

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

## Installation

1. Navigate to the scripts directory:

```bash
cd scripts
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

Or using a virtual environment (recommended):

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Usage

Run the cleaning script:

```bash
python clean_csv.py
```

## What It Does

The script performs the following data cleaning operations:

1. **Header Cleanup** - Removes trailing spaces from column names
2. **Date Normalization** - Two-pass parsing handling 3 formats: Standard SQL (YYYY-MM-DD), Unix timestamps, European (DD/MM/YYYY)
3. **Numeric Field Cleaning** - Removes quotes from numeric values in likes, comments, shares, follower counts
4. **Boolean Normalization** - Standardizes true/false/True/False/0/1 to consistent format
5. **Email Corruption Fixes** - Fixes double @@ and double .. in email addresses
6. **Special Character Sanitization** - Removes SQL injection patterns (';--, 'OR'1'='1) and control characters (\\n, \\t, \\r, \\x00)
7. **Incorrect total_engagements** - Handles N/A values and recalculates as likes + comments
8. **Text Cleaning** - Removes ", extra, commas" patterns
9. **Missing SVG Images** - Standardizes missing/empty SVG fields to NULL
10. **Tag Deduplication** - Removes duplicate tags while preserving order
11. **JSON Format Standardization** - Consistent spacing: ["#tech", "#AI"] (space after comma)
12. **Data Validation** - Validates emails, numeric ranges (follower counts, engagement rates)

## Output

- **Cleaned CSV**: `../data/social_media_posts_data_clean.csv`
- **Quality Report**: `../data/data_quality_report.json`

The quality report contains detailed information about all issues found and fixed.

## Data Quality Issues Fixed

### 1. Column Names with Trailing Spaces

**Problem**: Column headers had trailing whitespace (e.g., `author_bio `, `post_text `)  
**Solution**: Applied `.strip()` to all column names to remove leading/trailing spaces

### 2. Date Format Inconsistencies

**Problem**: 3 different date formats found:

- 18,222 Standard SQL (YYYY-MM-DD HH:MM:SS)
- 2,223 Unix timestamps (e.g., 1609459200)
- 4,555 European format (DD/MM/YYYY or DD-MM-YYYY)

**Solution**: Implemented two-pass parsing:

- Pass 1: Try text date formats (SQL, European) using explicit format strings
- Pass 2: Try Unix timestamp conversion for numeric values
- Pass 3: Pandas auto-detection as final fallback
- All dates standardized to `YYYY-MM-DD HH:MM:SS` format

### 3. Numeric Values Wrapped in Quotes

**Problem**: Numeric fields contained quoted strings ("1152", '2219')  
**Solution**:

- Removed all quotes using regex `str.replace(r'["\']', '')`
- Converted to numeric type with `pd.to_numeric()`
- Applied to: `likes`, `comments`, `shares`, `total_engagements`, `author_follower_count`

### 4. Boolean Inconsistencies

**Problem**: Multiple representations (true, false, True, False, 0, 1)  
**Solution**:

- Created boolean mapping dictionary
- Normalized all variations to Python boolean (True/False)
- Applied to `author_verified` field

### 5. Email Address Corruption

**Problem**:

- 606 emails with double @@ symbols (e.g., user@@domain.com)
- 663 emails with double dots (e.g., user@domain..com)

**Solution**:

- Replaced `@@` with single `@`
- Replaced consecutive dots `..` with single `.` using regex

### 6. SQL Injection & Special Characters

**Problem**: Malicious patterns and control characters in text fields  
**Solution**: Sanitized all text fields by removing:

- SQL injection patterns: `';--` and `'OR'1'='1`
- Control characters: newlines (`\n`), tabs (`\t`), carriage returns (`\r`), null bytes (`\x00`)
- Applied to: `author_bio`, `post_text`, `author_first_name`, `author_last_name`

### 7. Incorrect total_engagements (N/A Values & Calculation Errors)

**Problem**:

- 1,226 records with missing/N/A `total_engagements` values
- 3,740 records with calculation mismatches (incorrect sum)
- Total: 4,966 records requiring correction

**Solution**: Recalculated all values as `total_engagements = likes + comments` for entire dataset

### 8. Extra Commas in Text Fields

**Problem**: 1,228 records with ", extra, commas" pattern at end of text  
**Solution**: Removed pattern using regex `r',\s*extra,\s*commas\s*$'`

### 9. Missing SVG Images

**Problem**: 10,015 records (40.1%) with empty or missing `post_image_svg` fields  
**Solution**: Standardized all empty/missing values to empty string (will be NULL in database)

### 10. Duplicate Tags in post_tags Arrays

**Problem**: 11,469 duplicate tags across 9,983 rows (e.g., `["#tech", "#AI", "#tech"]`)  
**Solution**:

- Parsed JSON arrays
- Used `list(dict.fromkeys(tags))` to deduplicate while preserving order
- Re-serialized to JSON

### 11. Inconsistent JSON Formatting

**Problem**: Inconsistent spacing in JSON arrays  
**Solution**:

- Standardized all `post_tags` to consistent format: `["#tech", "#AI"]`
- Used `json.dumps()` with `separators=(', ', ', ')` for space after comma

### 12. Invalid Numeric Ranges

**Problem**: Potentially negative follower counts or out-of-range engagement rates  
**Solution**:

- Validated `author_follower_count` ≥ 0
- Validated `engagement_rate` between 0-100
- **Note**: No invalid ranges found in this dataset

## Data Quality Issues Summary

Complete report of all data quality issues found and fixed:

| Issue Category                   | Count          | Details                                                                                                                    |
| -------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Header Issues**                | 2              | Columns with trailing spaces (`author_bio `, `post_text `)                                                                 |
| **Date Format Issues**           | 3 formats      | • 18,222 Standard SQL (YYYY-MM-DD)<br>• 2,223 Unix timestamps<br>• 4,555 European (DD/MM/YYYY)                             |
| **Numeric Quote Issues**         | 7,409          | Values wrapped in quotes ("1152", '2219')<br>• 2,522 in `likes`<br>• 2,404 in `comments`<br>• 2,483 in `total_engagements` |
| **Boolean Inconsistencies**      | 6 variations   | Normalized from: true, false, True, False, 0, 1                                                                            |
| **Email Corruption**             | 1,269          | • 606 with double @@ symbols<br>• 663 with double .. (dots)                                                                |
| **Special Char Sanitization**    | 1,253          | SQL injection patterns & control chars<br>• Patterns: ';--, 'OR'1'='1, \\n, \\t, \\r, \\x00                                |
| **Incorrect total_engagements**  | 4,966          | N/A values & calculation errors<br>• 1,226 N/A values<br>• 3,740 mismatches<br>• Recalculated as `likes + comments`        |
| **Text Corruption**              | 1,228          | Removed ", extra, commas" pattern                                                                                          |
| **Missing SVG Images**           | 10,015 (40.1%) | Standardized empty fields to NULL                                                                                          |
| **Duplicate Tags**               | 11,469         | Removed from 9,983 rows (39.9%)<br>• Deduplicated while preserving order                                                   |
| **JSON Format Standardization**  | 25,000         | All rows reformatted<br>• Format: ["#tech", "#AI"] with space after comma                                                  |
| **Invalid Numeric Ranges**       | 0              | Validated follower counts ≥ 0 and engagement rates 0-100<br>• No issues found in dataset                                   |
| **Total Rows Processed**         | 25,000         | All rows successfully cleaned                                                                                              |
| **Total Issue Categories Fixed** | 12             | All categories documented in report                                                                                        |

## Example Output

```
================================================================================
CSV DATA CLEANING SCRIPT
================================================================================

[1/14] Reading CSV file...
✓ Loaded 25000 rows, 20 columns

[2/14] Cleaning column headers...
✓ Fixed 2 column headers with trailing spaces

[3/14] Cleaning numeric fields...
  ✓ Fixed 2522 quoted values in 'likes'
  ✓ Fixed 2404 quoted values in 'comments'
  ✓ Fixed 2483 quoted values in 'total_engagements'

[4/14] Normalizing boolean fields...
  ✓ Normalized boolean values

[5/14] Normalizing date formats...
  ✓ Parsed 25000 dates, fixed 0 problematic dates
    - Standard SQL format: 18222
    - Unix timestamps: 2223
    - European format: 4555

[6/14] Fixing email address corruption...
  ✓ Fixed 1269 corrupted emails (606 double @@, 663 double ..)

[7/14] Sanitizing special characters...
  ✓ Sanitized 1253 fields with special characters/injection attempts

[8/14] Cleaning text fields...
  ✓ Removed ', extra, commas' pattern from 1228 rows

[9/14] Handling missing SVG images...
  ✓ Standardized 10015 missing SVG images to NULL (40.1%)

[10/14] Deduplicating and formatting tags...
  ✓ Removed 11469 duplicate tags from 9983 rows
  ✓ Standardized JSON formatting in 25000 rows

[11/14] Handling N/A values...
  ✓ Found 1226 N/A values in total_engagements

[12/14] Recalculating total_engagements...
  ✓ Fixed 4966 incorrect calculations (3740 mismatches, 1226 N/A)

[13/14] Validating data...

[14/14] Saving cleaned data...
✓ Cleaned CSV saved to: ../data/social_media_posts_data_clean.csv
✓ Data quality report saved to: ../data/data_quality_report.json

================================================================================
CLEANING SUMMARY
================================================================================
Total rows processed: 25000
Total issue categories fixed: 12
Output file: ../data/social_media_posts_data_clean.csv
Report file: ../data/data_quality_report.json
================================================================================
```
