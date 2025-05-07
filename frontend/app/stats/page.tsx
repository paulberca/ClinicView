"use client";

import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "@/styles/StatsScreen.module.css";
import { fetchPatients } from "@/lib/api";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatsScreen = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadPatients = async () => {
      const allPatients: any[] = [];
      let page = 1;
      const limit = 50000;
      let fetched = [];

      try {
        do {
          fetched = await fetchPatients(page, limit);
          allPatients.push(...fetched);
          setPatients(allPatients);
          page++;
        } while (fetched.length === limit);
        setPatients(allPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const calculateStats = () => {
    const totalPatients = patients.length;
    const conditionCounts = patients.reduce((acc, patient) => {
      const condition = patient.condition.toLowerCase();
      acc[condition] = (acc[condition] || 0) + 1;
      return acc;
    }, {});
    const genderCounts = patients.reduce((acc, patient) => {
      acc[patient.gender] = (acc[patient.gender] || 0) + 1;
      return acc;
    }, {});
    const currentYear = new Date().getFullYear();
    const ages = patients.map((patient) => {
      const birthYear = new Date(patient.dateOfBirth).getFullYear();
      return currentYear - birthYear;
    });
    const totalAge = ages.reduce((sum, age) => sum + age, 0);
    const averageAge = totalAge / ages.length;

    const currentYearAdmissions = patients.filter((patient) => {
      return new Date(patient.admissionDate).getFullYear() === currentYear;
    }).length;

    return {
      totalPatients,
      conditionCounts,
      genderCounts,
      averageAge: averageAge.toFixed(1),
      currentYearAdmissions,
    };
  };

  const stats = calculateStats();

  const conditionData = {
    labels: ["Stable", "Recovering", "Critical"],
    datasets: [
      {
        data: [
          stats.conditionCounts.stable || 0,
          stats.conditionCounts.recovering || 0,
          stats.conditionCounts.critical || 0,
        ],
        backgroundColor: ["#2e7d32", "#f57c00", "#c62828"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  if (loading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className={styles.statsContainer}>
      <h2 className={styles.statsTitle}>Hospital Statistics</h2>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Patients</h3>
          <div className={styles.statValue}>{stats.totalPatients}</div>
        </div>

        <div className={styles.statCard}>
          <h3>Average Age</h3>
          <div className={styles.statValue}>{stats.averageAge} years</div>
        </div>

        <div className={styles.statCard}>
          <h3>Admissions This Year</h3>
          <div className={styles.statValue}>{stats.currentYearAdmissions}</div>
        </div>
      </div>

      <div className={styles.chartSection}>
        <div className={styles.chartContainer}>
          <h3>Patients by Condition</h3>
          <div className={styles.chartWrapper}>
            <Pie data={conditionData} options={chartOptions} />
          </div>
        </div>

        <div className={styles.chartContainer}>
          <h3>Patients by Gender</h3>
          <div className={styles.genderStats}>
            <div className={styles.statRow}>
              <span>Male</span>
              <div className={styles.statBar}>
                <div
                  className={`${styles.statBarFill} ${styles.maleBar}`}
                  style={{
                    width: `${
                      ((stats.genderCounts.Male || 0) / stats.totalPatients) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <span>{stats.genderCounts.Male || 0}</span>
            </div>
            <div className={styles.statRow}>
              <span>Female</span>
              <div className={styles.statBar}>
                <div
                  className={`${styles.statBarFill} ${styles.femaleBar}`}
                  style={{
                    width: `${
                      ((stats.genderCounts.Female || 0) / stats.totalPatients) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <span>{stats.genderCounts.Female || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;
