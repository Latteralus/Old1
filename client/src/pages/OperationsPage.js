import React, { useState, useEffect } from 'react';
import { fetchEmployees } from '../services/employees';

const OperationsPage = () => {
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);

    const [idleEmployeesCount, setIdleEmployeesCount] = useState(0);
    const [activeTasksCount, setActiveTasksCount] = useState(0);

    // Fetch and update data periodically
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch employees using API call
                const fetchedEmployees = await fetchEmployees();
                setEmployees(fetchedEmployees);

                // Simulate fetching data for tasks, customers, and prescriptions
                // Replace these with actual API calls when your backend is ready
                setTasks(window.taskManager?.tasks || []);
                setCustomers(window.customers?.activeCustomers || []);
                setPrescriptions(window.prescriptions?.activePrescriptions || []);

                // Calculate idle employees and active tasks
                const idleCount = fetchedEmployees.filter(emp => !emp.currentTaskId).length;
                setIdleEmployeesCount(idleCount);

                const activeCount = window.taskManager?.tasks.filter(task => task.status !== 'completed').length || 0;
                setActiveTasksCount(activeCount);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Initial fetch

        const interval = setInterval(fetchData, 2000); // Refresh every 2 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <div className="operations-page-container">
            {/* Header */}
            <h2>Operations (Live Environment)</h2>
            <p>Real-time status of employees, tasks, and customers.</p>

            {/* Summary Row */}
            <div className="summary-row">
                <div className="summary-card">
                    <h4>Active Tasks</h4>
                    <p>{activeTasksCount}</p>
                </div>
                <div className="summary-card">
                    <h4>Idle Employees</h4>
                    <p>{idleEmployeesCount}</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="main-grid">
                {/* Employees & Tasks Section */}
                <div className="section">
                    <h3>Employees & Tasks</h3>
                    <div>
                        {employees.map((emp) => (
                            <div key={emp.id} className="employee-card">
                                <strong>
                                    {emp.firstName} {emp.lastName} ({emp.role})
                                </strong>
                                <p>
                                    {emp.currentTaskId
                                        ? `Current Task: ${emp.currentTaskId}`
                                        : 'Current Task: None (Idle)'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customers Section */}
                <div className="section">
                    <h3>Customers in the Pharmacy</h3>
                    <div>
                        {customers.map((customer) => (
                            <div key={customer.id} className="customer-card">
                                <strong>{customer.firstName} {customer.lastName}</strong>
                                <p>Status: {customer.status}</p>
                                <p>Arrived at: {new Date(customer.arrivedAt).toLocaleTimeString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prescriptions Section */}
                <div className="section">
                    <h3>Active Prescriptions</h3>
                    <div>
                        {prescriptions.map((prescription) => (
                            <div key={prescription.id} className="prescription-card">
                                <p><strong>ID:</strong> {prescription.id}</p>
                                <p><strong>Product:</strong> {prescription.productName}</p>
                                <p><strong>Status:</strong> {prescription.status}</p>
                                {prescription.dosage && <p><strong>Dosage:</strong> {prescription.dosage}</p>}
                                {prescription.frequency && <p><strong>Frequency:</strong> {prescription.frequency}</p>}
                                {prescription.doctorName && <p><strong>Doctor:</strong> {prescription.doctorName}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperationsPage;