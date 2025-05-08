import random
import psycopg2
from datetime import datetime, timedelta
from faker import Faker
import os
import argparse
from tqdm import tqdm
from dotenv import load_dotenv

load_dotenv()
fake = Faker()

MAX_DOCTORS = 20

def generate_family_doctors():
    doctors = []
    specialties = ['General Practice', 'Pediatrics', 'Cardiology', 'Neurology', 'Orthopedics',
                   'Dermatology', 'Psychiatry', 'Oncology', 'Gastroenterology', 'Endocrinology']

    for _ in range(MAX_DOCTORS):
        doctors.append({
            "name": f"Dr. {fake.name()}",
            "specialty": random.choice(specialties),
            "contact_number": fake.phone_number()
        })
    
    return doctors

def generate_doctor_users():
    users = []
    for i in range(MAX_DOCTORS):
        email = f"doctor{i+1}@example.com"
        password = "hashedpassword"  # replace with actual hash if needed
        users.append({
            "email": email,
            "password": password,
            "role": "DOCTOR"
        })
    return users

def insert_doctor_users(conn, users):
    cur = conn.cursor()
    user_ids = []
    for u in users:
        cur.execute("""
            INSERT INTO "users" ("email", "password", "role")
            VALUES (%s, %s, %s) RETURNING id
        """, (u["email"], u["password"], u["role"]))
        user_id = cur.fetchone()[0]
        user_ids.append(user_id)

    conn.commit()
    cur.close()
    return user_ids

def insert_family_doctors(conn, doctors, user_ids):
    cur = conn.cursor()
    ids = []
    for i, d in enumerate(doctors):
        cur.execute("""
            INSERT INTO "FamilyDoctor" ("name", "specialty", "contactNumber", "userId")
            VALUES (%s, %s, %s, %s) RETURNING id
        """, (d['name'], d['specialty'], d['contact_number'], user_ids[i]))
        doctor_id = cur.fetchone()[0]
        ids.append(doctor_id)

    conn.commit()
    cur.close()
    return ids


def generate_patients(count, doctor_ids):
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

    for _ in tqdm(range(count), desc="🔄 Generating patients"):
        age = random.randint(18, 90)
        dob = datetime.now() - timedelta(days=age*365 + random.randint(0, 364))
        admission_date = datetime.now() - timedelta(days=random.randint(0, 730))
        gender = random.choice(['Male', 'Female'])
        allergy_count = random.randint(0, 3)
        allergies = random.sample([a for a in allergies_list if a != 'None'], allergy_count) if allergy_count else ['None']
        family_doctor_id = random.choice(doctor_ids)

        patients.append({
            "name": fake.name(),
            "date_of_birth": dob.strftime('%Y-%m-%d'),
            "gender": gender,
            "contact_number": fake.phone_number(),
            "home_address": f"{fake.street_address()}, {fake.city()}, {fake.state_abbr()}",
            "allergies": allergies,
            "blood_type": random.choice(blood_types),
            "chronic_condition": random.choice(chronic_conditions),
            "insurance": random.choice(insurance_providers),
            "admission_date": admission_date.strftime('%Y-%m-%d'),
            "condition": random.choice(conditions),
            "family_doctor_id": family_doctor_id
        })

    return patients

def insert_patients(conn, patients):
    cur = conn.cursor()

    for p in tqdm(patients, desc="⬇️ Inserting patients into DB"):
        cur.execute("""
            INSERT INTO "Patient" (
                "name", "dateOfBirth", "gender", "contactNumber", "homeAddress",
                "allergies", "bloodType", "chronicCondition",
                "insurance", "admissionDate", "condition", "familyDoctorId"
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            p['name'], p['date_of_birth'], p['gender'], p['contact_number'],
            p['home_address'], p['allergies'], p['blood_type'],
            p['chronic_condition'], p['insurance'],
            p['admission_date'], p['condition'], p['family_doctor_id']
        ))

    conn.commit()
    cur.close()
    print(f"✅ Inserted {len(patients)} patients into the database.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate random patient and doctor data and insert into PostgreSQL")
    parser.add_argument('--count', type=int, default=20, help="Number of patients to generate (default: 20)")
    args = parser.parse_args()

    conn = psycopg2.connect(
        host=os.getenv("PG_HOST", "localhost"),
        database=os.getenv("PG_DB", "hospital"),
        user=os.getenv("PG_USER", "postgres"),
        password=os.getenv("PG_PASSWORD", "password"),
        port=os.getenv("PG_PORT", 5432)
    )
    # Clear existing data
    with conn.cursor() as cur:
        cur.execute('DELETE FROM "Patient";')
        cur.execute('DELETE FROM "FamilyDoctor";')
        cur.execute('DELETE FROM "users";')
        conn.commit()

    # Generate and insert users for doctors
    users = generate_doctor_users()
    user_ids = insert_doctor_users(conn, users)

    # Generate and insert doctors linked to users
    doctors = generate_family_doctors()
    doctor_ids = insert_family_doctors(conn, doctors, user_ids)

    # Generate and insert patients
    patients = generate_patients(args.count, doctor_ids)
    insert_patients(conn, patients)


    conn.close()
