import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const options = [
        { value: 'alphabets', label: 'Alphabets' },
        { value: 'numbers', label: 'Numbers' },
        { value: 'highest_alphabet', label: 'Highest Alphabet' }
    ];

    const handleInputChange = (e) => {
        setJsonInput(e.target.value);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const parsedInput = JSON.parse(jsonInput);
            if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
                throw new Error("Invalid JSON format");
            }

            const res = await axios.post('https://bajaj-backend-tau.vercel.app/bfhl', parsedInput);
            setResponse(res.data);
            setError('');
        } catch (err) {
            setError(err.message);
            setResponse(null);
        }
    };

    const handleOptionChange = (selected) => {
        setSelectedOptions(selected);
    };

    const renderResponse = () => {
        if (!response) return null;

        let filteredResponse = {};
        if (selectedOptions.some(option => option.value === 'numbers')) filteredResponse.numbers = response.numbers;
        if (selectedOptions.some(option => option.value === 'alphabets')) filteredResponse.alphabets = response.alphabets;
        if (selectedOptions.some(option => option.value === 'highest_alphabet')) filteredResponse.highest_alphabet = response.highest_alphabet;

        return (
            <div className="response">
                <h3>Filtered Response</h3>
                {filteredResponse.numbers && <div>Numbers: {filteredResponse.numbers.join(',')}</div>}
                {filteredResponse.alphabets && <div>Alphabets: {filteredResponse.alphabets.join(',')}</div>}
                {filteredResponse.highest_alphabet && <div>Highest Alphabet: {filteredResponse.highest_alphabet.join(',')}</div>}
            </div>
        );
    };

    return (
        <div className="App">
            <h1>RA2111003030030</h1>
            <form onSubmit={handleFormSubmit}>
                <label>API Input</label>
                <textarea value={jsonInput} onChange={handleInputChange} placeholder='Enter JSON here' />
                <button type="submit">Submit</button>
            </form>
            {error && <div className="error">{error}</div>}
            {response && (
                <div className="options">
                    <label>Multi Filter</label>
                    <Select
                        isMulti
                        options={options}
                        value={selectedOptions}
                        onChange={handleOptionChange}
                    />
                </div>
            )}
            {renderResponse()}
        </div>
    );
}

export default App;
