import React, { useState, useEffect } from 'react';
import './App.css';
import Form from './Components/Form';
import Read from './Components/Read';

const App = () => {
    const [submittedData, setSubmittedData] = useState([]);
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3310/api/data');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setSubmittedData(jsonData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        fetchData();
    }, []);

    const handleFormSubmit = async (data) => {
        try {
            const response = await fetch('http://localhost:3310/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Failed to submit data');
            }
            const jsonData = await response.json();
            setSubmittedData([...submittedData, jsonData]);
        } catch (error) {
            console.error('Error submitting data: ', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3310/api/data/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete data');
            }
            setSubmittedData(submittedData.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting data: ', error);
        }
    };

    const handleEdit = async (id, newData) => {
        console.log('New data:', newData);
        try {
            const response = await fetch(`http://localhost:3310/api/data/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData)
            });
            if (!response.ok) {
                throw new Error('Failed to edit data');
            }
            setSubmittedData(prevData => prevData.map(item => (item.id === id ? newData : item)));
        } catch (error) {
            console.error('Error editing data: ', error);
        }
    };

    return (
        <div className="container">
            <h1>Survey Form:</h1>
            <h3>Please Enter your Name and Email:</h3>
            <Form onFormSubmit={handleFormSubmit} editItem={editItem} setEditItem={setEditItem} handleEdit={handleEdit} />

            {submittedData.length > 0 && (
                <div>
                    <h2>Submitted Data:</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submittedData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>
                                        <button onClick={() => handleDelete(item.id)} className="btn btn-danger">Delete</button>
                                        <button onClick={() => setEditItem({ id: item.id, data: item })} className="btn btn-warning">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default App;