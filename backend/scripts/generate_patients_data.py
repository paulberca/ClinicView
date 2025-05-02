import random
import psycopg2
from datetime import datetime, timedelta
from faker import Faker
import os
import argparse
from dotenv import load_dotenv

load_dotenv()
fake = Faker()

def generate_patients(count=20):
    patients = []
    conditions = ['Stable', 'Critical', 'Recovering']
    blood_types = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
    allergies_list = [
        'Penicillin', 'Peanuts', 'Latex', 'Shellfish', 'Dust', 
        'Pollen', 'Sulfa Drugs', 'None'
    ]
    chronic_conditions = [
        'Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 
        'Arthritis', 'Migraine', 'Epilepsy', 'Thyroid Disorder',
        'High Cholesterol', 'None'
    ]
    insurance_providers = [
        'Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare',
        'Humana', 'Kaiser Permanente', 'Oscar Health', 'Medicare', 'Medicaid',
        'Anthem Blue Cross'
    ]
    
    for _ in range(count):
        age = random.randint(18, 90)
        dob = datetime.now() - timedelta(days=age*365 + random.randint(0, 364))
        admission_date = datetime.now() - timedelta(days=random.randint(0, 730))
        gender = random.choice(['Male', 'Female'])
        allergy_count = random.randint(0, 3)
        allergies = random.sample([a for a in allergies_list if a != 'None'], allergy_count) if allergy_count else ['None']

        patients.append({
            "name": fake.name(),
            "date_of_birth": dob.strftime('%Y-%m-%d'),
            "gender": gender,
            "contact_number": fake.phone_number(),
            "home_address": f"{fake.street_address()}, {fake.city()}, {fake.state_abbr()}",
            "allergies": allergies,
            "blood_type": random.choice(blood_types),
            "chronic_condition": random.choice(chronic_conditions),
            "family_doctor": f"Dr. {fake.name()}",
            "insurance": random.choice(insurance_providers),
            "admission_date": admission_date.strftime('%Y-%m-%d'),
            "condition": random.choice(conditions)
        })
    
    return patients

def insert_patients(patients):
    conn = psycopg2.connect(
        host=os.getenv("PG_HOST", "localhost"),
        database=os.getenv("PG_DB", "hospital"),
        user=os.getenv("PG_USER", "postgres"),
        password=os.getenv("PG_PASSWORD", "password"),
        port=os.getenv("PG_PORT", 5432)
    )
    cur = conn.cursor()

    for p in patients:
        cur.execute("""
            INSERT INTO "Patient" (
                "name", "dateOfBirth", "gender", "contactNumber", "homeAddress",
                "allergies", "bloodType", "chronicCondition", "familyDoctor",
                "insurance", "admissionDate", "condition"
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            p['name'], p['date_of_birth'], p['gender'], p['contact_number'],
            p['home_address'], p['allergies'], p['blood_type'],
            p['chronic_condition'], p['family_doctor'], p['insurance'],
            p['admission_date'], p['condition']
        ))

    conn.commit()
    cur.close()
    conn.close()
    print(f"✅ Inserted {len(patients)} patients into the database.")

if __name__ == "__main__":
    # Set up command line argument parsing
    parser = argparse.ArgumentParser(description="Generate random patient data and insert into PostgreSQL")
    parser.add_argument('--count', type=int, default=20, help="Number of patients to generate (default: 20)")
    
    # Parse arguments
    args = parser.parse_args()

    # Generate patients and insert them
    patients = generate_patients(args.count)
    insert_patients(patients)
