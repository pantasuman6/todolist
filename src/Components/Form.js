// Form.js
import React, { useState, useEffect } from 'react';

const Form = ({ onFormSubmit, editItem, setEditItem, handleEdit }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (editItem) {
            setName(editItem.name);
            setEmail(editItem.email);
        }
    }, [editItem]);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { name, email };
        // console.log(editItem);
        // console.log(JSON.stringify(editItem, null, 2));
        if (editItem) {
            handleEdit(editItem.id, data);
        } else {
            onFormSubmit(data);
        }
        setName("");
        setEmail("");
        setEditItem(null);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputName1" className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="exampleInputName1"
                        value={name}
                        onChange={handleNameChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <div id="emailHelp" className="form-text">Privacy Concern: We'll never share your email with anyone else.</div>
                </div>
                <br/>
                <button type="submit" className="btn btn-primary">{editItem ? 'Update' : 'Submit'}</button>
                {editItem && (
                    <button type="button" className="btn btn-secondary" onClick={() => setEditItem(null)}>Cancel</button>
                )}
            </form>
        </div>
    );
};

export default Form;

