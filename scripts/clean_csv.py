#!/usr/bin/env python3
"""
Data Cleaning Script for Social Media Posts Data CSV file
Cleans corrupted CSV data and outputs a clean version with a quality report.
"""

import pandas as pd
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any

# Configuration
INPUT_CSV = "../data/social_media_posts_data.csv"
OUTPUT_CSV = "../data/social_media_posts_data_clean.csv"
REPORT_JSON = "../data/data_quality_report.json"


class DataQualityReport:
    """Tracks all data quality issues found and fixed."""
    
    def __init__(self):
        self.issues: Dict[str, List[Any]] = {
            "header_issues": [],
            "date_format_issues": [],
            "numeric_quote_issues": [],
            "boolean_inconsistencies": [],
            "na_values": [],
            "text_corruption": [],
            "email_corruption": [],
            "special_char_sanitization": [],
            "missing_svg_images": [],
            "duplicate_tags": [],
            "json_formatting": [],
            "calculation_errors": [],
            "validation_errors": [],
            "total_rows_processed": 0,
            "total_issue_categories_fixed": 0
        }
        self._categories_with_issues = set()
    
    def add_issue(self, category: str, issue: Any):
        """Add an issue to the report."""
        if category in self.issues:
            self.issues[category].append(issue)
            self._categories_with_issues.add(category)
    
    def save(self, filepath: str):
        """Save report as JSON."""
        # Count categories that have at least one issue
        self.issues["total_issue_categories_fixed"] = len(self._categories_with_issues)
        
        with open(filepath, 'w') as f:
            json.dump(self.issues, f, indent=2, default=str)
        print(f"\n✓ Data quality report saved to: {filepath}")


def clean_csv_data(input_path: str, output_path: str, report_path: str):
    """Main function to clean CSV data."""
    
    print("=" * 80)
    print("CSV DATA CLEANING SCRIPT")
    print("=" * 80)
    
    report = DataQualityReport()
    
    # Step 1: Read CSV with proper handling
    print("\n[1/14] Reading CSV file...")
    try:
        df = pd.read_csv(input_path, encoding='utf-8')
        report.issues["total_rows_processed"] = len(df)
        print(f"✓ Loaded {len(df)} rows, {len(df.columns)} columns")
    except Exception as e:
        print(f"✗ Error reading CSV: {e}")
        return
    
    # Step 2: Clean column headers
    print("\n[2/14] Cleaning column headers...")
    original_columns = df.columns.tolist()
    df.columns = df.columns.str.strip()
    
    header_changes = []
    for old, new in zip(original_columns, df.columns):
        if old != new:
            header_changes.append({"old": old, "new": new})
            report.add_issue("header_issues", {"column": old, "fixed": new})
    
    if header_changes:
        print(f"✓ Fixed {len(header_changes)} column headers with trailing spaces")
    else:
        print("✓ All column headers are clean")
    
    # Step 3: Clean numeric fields with quotes
    print("\n[3/14] Cleaning numeric fields...")
    numeric_columns = ['likes', 'comments', 'shares', 'total_engagements', 'author_follower_count']
    
    for col in numeric_columns:
        if col in df.columns:
            # Count issues before fixing
            issues_before = df[col].astype(str).str.contains(r'["\']').sum()
            
            # Remove quotes and convert to numeric
            df[col] = df[col].astype(str).str.replace(r'["\']', '', regex=True)
            df[col] = pd.to_numeric(df[col], errors='coerce')
            
            if issues_before > 0:
                print(f"  ✓ Fixed {issues_before} quoted values in '{col}'")
                report.add_issue("numeric_quote_issues", {
                    "column": col,
                    "count": int(issues_before)
                })
    
    # Step 4: Normalize boolean fields
    print("\n[4/14] Normalizing boolean fields...")
    boolean_map = {
        'true': True, 'True': True, '1': True, 1: True,
        'false': False, 'False': False, '0': False, 0: False
    }
    
    if 'author_verified' in df.columns:
        original_values = df['author_verified'].unique()
        df['author_verified'] = df['author_verified'].map(boolean_map).fillna(False)
        
        inconsistent = [v for v in original_values if str(v) not in ['True', 'False', 'true', 'false']]
        if inconsistent or len(original_values) > 2:
            print(f"  ✓ Normalized boolean values: {list(original_values)}")
            report.add_issue("boolean_inconsistencies", {
                "column": "author_verified",
                "original_values": [str(v) for v in original_values]
            })
    
    # Step 5: Clean and normalize dates (Two-pass parsing)
    print("\n[5/14] Normalizing date formats...")
    
    if 'post_date' in df.columns:
        date_issues = 0
        format_types = {"standard": 0, "unix_timestamp": 0, "european": 0, "other": 0}
        parsed_dates = []
        
        for idx, date_val in enumerate(df['post_date']):
            try:
                # Two-pass approach: Try text dates first, then timestamps
                parsed = None
                format_detected = "standard"
                
                # Pass 1: Try standard text date formats
                date_formats = [
                    ('%Y-%m-%d %H:%M:%S', 'standard'),      # 2024-07-28 15:20:48
                    ('%d-%m-%Y %H:%M:%S', 'european'),      # 28-07-2024 15:20:48
                    ('%d/%m/%Y %H:%M:%S', 'european'),      # 28/07/2024 15:20:48
                    ('%Y-%m-%d', 'standard'),                # 2025-05-13
                    ('%d-%m-%Y', 'european'),                # 13-05-2025
                    ('%d/%m/%Y %H:%M', 'european'),          # 19/08/2024 15:20
                    ('%d/%m/%Y', 'european'),                # 30/05/2025
                ]
                
                for fmt, fmt_type in date_formats:
                    try:
                        parsed = pd.to_datetime(date_val, format=fmt)
                        format_detected = fmt_type
                        break
                    except:
                        continue
                
                # Pass 2: If text parsing failed, try Unix timestamp
                if parsed is None:
                    try:
                        # Check if it's a numeric timestamp
                        timestamp = float(date_val)
                        if 1000000000 <= timestamp <= 2000000000:  # Valid range ~2001-2033
                            parsed = pd.to_datetime(timestamp, unit='s')
                            format_detected = "unix_timestamp"
                    except:
                        pass
                
                # Pass 3: Final fallback - let pandas figure it out
                if parsed is None:
                    parsed = pd.to_datetime(date_val, errors='coerce')
                    format_detected = "other"
                
                if pd.isna(parsed):
                    date_issues += 1
                    parsed = pd.to_datetime('2024-01-01')  # Default fallback
                    format_detected = "other"
                else:
                    format_types[format_detected] += 1
                
                parsed_dates.append(parsed)
                
            except Exception as e:
                date_issues += 1
                parsed_dates.append(pd.to_datetime('2024-01-01'))
                format_types["other"] += 1
        
        df['post_date'] = parsed_dates
        
        print(f"  ✓ Parsed {len(df)} dates, fixed {date_issues} problematic dates")
        print(f"    - Standard SQL format: {format_types['standard']}")
        print(f"    - Unix timestamps: {format_types['unix_timestamp']}")
        print(f"    - European format: {format_types['european']}")
        if format_types['other'] > 0:
            print(f"    - Other/fallback: {format_types['other']}")
        
        if date_issues > 0 or format_types['unix_timestamp'] > 0 or format_types['european'] > 0:
            report.add_issue("date_format_issues", {
                "column": "post_date",
                "issues_fixed": date_issues,
                "format_breakdown": format_types,
                "note": "Two-pass parsing: text dates first, then Unix timestamps"
            })
    
    # Step 6: Fix email address corruption
    print("\n[6/14] Fixing email address corruption...")
    
    if 'author_email' in df.columns:
        # Fix double @@ 
        double_at_count = df['author_email'].astype(str).str.contains('@@', regex=False, na=False).sum()
        df['author_email'] = df['author_email'].astype(str).str.replace('@@', '@', regex=False)
        
        # Fix double ..
        double_dot_count = df['author_email'].astype(str).str.contains('\\.\\.', regex=True, na=False).sum()
        df['author_email'] = df['author_email'].astype(str).str.replace(r'\.\.+', '.', regex=True)
        
        total_email_fixes = double_at_count + double_dot_count
        if total_email_fixes > 0:
            print(f"  ✓ Fixed {total_email_fixes} corrupted emails ({double_at_count} double @@, {double_dot_count} double ..)")
            report.add_issue("email_corruption", {
                "double_at": int(double_at_count),
                "double_dots": int(double_dot_count),
                "total": int(total_email_fixes)
            })
        else:
            print("  ✓ No email corruption found")
    
    # Step 7: Sanitize special characters and injection attempts
    print("\n[7/14] Sanitizing special characters...")
    
    text_fields = ['author_bio', 'post_text', 'author_first_name', 'author_last_name']
    sanitization_count = 0
    
    for field in text_fields:
        if field in df.columns:
            # Remove potential SQL injection patterns and control characters
            original_values = df[field].copy()
            
            # Remove/escape dangerous patterns
            df[field] = df[field].astype(str).str.replace(r"';--", "", regex=True)  # SQL injection
            df[field] = df[field].str.replace(r"'OR'1'='1", "", regex=False)         # SQL injection
            df[field] = df[field].str.replace(r'\n', ' ', regex=False)                # Newlines
            df[field] = df[field].str.replace(r'\t', ' ', regex=False)                # Tabs
            df[field] = df[field].str.replace(r'\r', '', regex=False)                 # Carriage returns
            df[field] = df[field].str.replace(r'\x00', '', regex=False)               # Null bytes
            
            # Count changes
            changes = (original_values != df[field]).sum()
            if changes > 0:
                sanitization_count += changes
    
    if sanitization_count > 0:
        print(f"  ✓ Sanitized {sanitization_count} fields with special characters/injection attempts")
        report.add_issue("special_char_sanitization", {
            "fields_sanitized": sanitization_count,
            "patterns_removed": ["';--", "'OR'1'='1", "\\n", "\\t", "\\r", "\\x00"],
            "note": "Removed SQL injection patterns and control characters for security"
        })
    else:
        print("  ✓ No dangerous special characters found")
    
    # Step 8: Clean text fields
    print("\n[8/14] Cleaning text fields...")
    
    text_issues = 0
    
    # Remove extra commas pattern
    if 'post_text' in df.columns:
        extra_comma_pattern = r',\s*extra,\s*commas\s*$'
        has_extra = df['post_text'].astype(str).str.contains(extra_comma_pattern, regex=True, na=False)
        extra_comma_count = has_extra.sum()
        
        if extra_comma_count > 0:
            df['post_text'] = df['post_text'].astype(str).str.replace(extra_comma_pattern, '', regex=True)
            print(f"  ✓ Removed ', extra, commas' pattern from {extra_comma_count} rows")
            text_issues += extra_comma_count
            report.add_issue("text_corruption", {
                "pattern": "extra_commas",
                "count": int(extra_comma_count)
            })
    
    # Clean location field - remove extra commas
    if 'location' in df.columns:
        df['location'] = df['location'].astype(str).str.strip()
        df['location'] = df['location'].replace(['nan', 'None', ''], '')
    
    # Step 9: Handle missing SVG images
    print("\n[9/14] Handling missing SVG images...")
    
    if 'post_image_svg' in df.columns:
        # Count empty/missing SVG images
        missing_svg = df['post_image_svg'].isna() | (df['post_image_svg'].astype(str).str.strip() == '') | (df['post_image_svg'].astype(str) == 'nan')
        missing_count = missing_svg.sum()
        
        # Standardize to empty string (will be NULL in database)
        df.loc[missing_svg, 'post_image_svg'] = ''
        
        percentage = (missing_count / len(df)) * 100
        print(f"  ✓ Standardized {missing_count} missing SVG images to NULL ({percentage:.1f}%)")
        report.add_issue("missing_svg_images", {
            "count": int(missing_count),
            "percentage": round(percentage, 1),
            "note": "Standardized to empty string (NULL in database)"
        })
    
    # Step 10: Deduplicate and format tags consistently
    print("\n[10/14] Deduplicating and formatting tags...")
    
    if 'post_tags' in df.columns:
        rows_with_duplicates = 0
        total_duplicates_removed = 0
        rows_reformatted = 0
        
        for idx, tags_str in enumerate(df['post_tags']):
            try:
                # Parse JSON tags
                tags = json.loads(tags_str)
                
                # Count duplicates
                original_count = len(tags)
                unique_tags = list(dict.fromkeys(tags))  # Preserves order, removes duplicates
                duplicates_count = original_count - len(unique_tags)
                
                if duplicates_count > 0:
                    rows_with_duplicates += 1
                    total_duplicates_removed += duplicates_count
                
                # Reformat with consistent spacing (space after comma)
                formatted = json.dumps(unique_tags, separators=(', ', ', '))
                
                if formatted != tags_str:
                    rows_reformatted += 1
                
                df.at[idx, 'post_tags'] = formatted
                    
            except (json.JSONDecodeError, TypeError):
                # Skip rows with invalid JSON
                continue
        
        if rows_with_duplicates > 0:
            print(f"  ✓ Removed {total_duplicates_removed} duplicate tags from {rows_with_duplicates} rows")
            report.add_issue("duplicate_tags", {
                "rows_affected": int(rows_with_duplicates),
                "total_duplicates_removed": int(total_duplicates_removed),
                "note": "Deduplicated tags while preserving order"
            })
        else:
            print("  ✓ No duplicate tags found")
        
        if rows_reformatted > 0:
            print(f"  ✓ Standardized JSON formatting in {rows_reformatted} rows")
            report.add_issue("json_formatting", {
                "rows_reformatted": int(rows_reformatted),
                "format": '["#tech", "#AI"]',
                "note": "Standardized to space after comma for consistency"
            })
    
    # Step 11: Handle N/A values in total_engagements
    print("\n[11/14] Handling N/A values...")
    
    if 'total_engagements' in df.columns:
        na_mask = df['total_engagements'].isna()
        na_count = na_mask.sum()
        
        if na_count > 0:
            print(f"  ✓ Found {na_count} N/A values in total_engagements")
            report.add_issue("na_values", {
                "column": "total_engagements",
                "count": int(na_count)
            })
    
    # Step 12: Recalculate total_engagements
    print("\n[12/14] Recalculating total_engagements...")
    
    if all(col in df.columns for col in ['likes', 'comments', 'total_engagements']):
        df['calculated_engagements'] = df['likes'] + df['comments']
        
        # Find mismatches
        mismatch_mask = (df['total_engagements'].fillna(0) != df['calculated_engagements']) & df['total_engagements'].notna()
        mismatch_count = mismatch_mask.sum()
        
        # Also fix N/A values
        na_mask = df['total_engagements'].isna()
        na_count = na_mask.sum()
        
        # Update total_engagements with correct calculation
        df['total_engagements'] = df['calculated_engagements']
        df = df.drop('calculated_engagements', axis=1)
        
        total_fixes = mismatch_count + na_count
        if total_fixes > 0:
            print(f"  ✓ Fixed {total_fixes} incorrect calculations ({mismatch_count} mismatches, {na_count} N/A)")
            report.add_issue("calculation_errors", {
                "column": "total_engagements",
                "mismatches": int(mismatch_count),
                "na_values": int(na_count)
            })
    
    # Step 13: Validate data
    print("\n[13/14] Validating data...")
    
    validation_issues = 0
    
    # Validate email format
    if 'author_email' in df.columns:
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        invalid_emails = ~df['author_email'].astype(str).str.match(email_pattern, na=False)
        invalid_count = invalid_emails.sum()
        
        if invalid_count > 0:
            print(f"  ⚠ Found {invalid_count} potentially invalid email formats")
            validation_issues += invalid_count
    
    # Validate numeric ranges
    if 'author_follower_count' in df.columns:
        negative = (df['author_follower_count'] < 0).sum()
        if negative > 0:
            df.loc[df['author_follower_count'] < 0, 'author_follower_count'] = 0
            print(f"  ✓ Fixed {negative} negative follower counts")
            validation_issues += negative
    
    if 'engagement_rate' in df.columns:
        out_of_range = ((df['engagement_rate'] < 0) | (df['engagement_rate'] > 100)).sum()
        if out_of_range > 0:
            df['engagement_rate'] = df['engagement_rate'].clip(0, 100)
            print(f"  ✓ Fixed {out_of_range} out-of-range engagement rates")
            validation_issues += out_of_range
    
    if validation_issues > 0:
        report.add_issue("validation_errors", {"total_issues": validation_issues})
    
    # Step 14: Save cleaned data
    print("\n[14/14] Saving cleaned data...")
    
    # Create output directory if it doesn't exist
    output_dir = Path(output_path).parent
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Save cleaned CSV
    df.to_csv(output_path, index=False, encoding='utf-8')
    print(f"✓ Cleaned CSV saved to: {output_path}")
    
    # Save report
    report.save(report_path)
    
    # Print summary
    print("\n" + "=" * 80)
    print("CLEANING SUMMARY")
    print("=" * 80)
    print(f"Total rows processed: {report.issues['total_rows_processed']}")
    print(f"Total issue categories fixed: {report.issues['total_issue_categories_fixed']}")
    print(f"Output file: {output_path}")
    print(f"Report file: {report_path}")
    print("=" * 80)


if __name__ == "__main__":
    # Get script directory
    script_dir = Path(__file__).parent
    
    # Resolve paths relative to script location
    input_csv = (script_dir / INPUT_CSV).resolve()
    output_csv = (script_dir / OUTPUT_CSV).resolve()
    report_json = (script_dir / REPORT_JSON).resolve()
    
    # Check if input file exists
    if not input_csv.exists():
        print(f"✗ Error: Input CSV not found at {input_csv}")
        print(f"  Expected location: {input_csv}")
        exit(1)
    
    # Run cleaning
    clean_csv_data(str(input_csv), str(output_csv), str(report_json))

