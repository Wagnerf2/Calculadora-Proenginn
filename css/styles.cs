* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background-color: #461872;
    color: #fff;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.container {
    max-width: 900px;
    width: 100%;
    background-color: transparent;
    padding: 30px;
    border-radius: 10px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;
}

.logo-img {
    width: 100px;
    height: auto;
    margin-right: 20px;
}

.header-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #fff;
}

h2 {
    color: #fff;
    font-size: 1.2rem;
    margin-bottom: 15px;
}

.input-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

label {
    font-weight: bold;
    font-size: 1rem;
    margin-right: 10px;
    color: #fff;
}

input {
    flex-grow: 1;
    padding: 8px;
    font-size: 0.9rem;
    width: 60%;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    background-color: #4a148c;
    color: white;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 1rem;
}

button:hover {
    background-color: #380d6f;
}

.table-section {
    margin-bottom: 20px;
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    font-size: 0.85rem;
}

th, td {
    border: 1px solid #ddd;
    padding: 4px 6px;
    text-align: center;
}

th {
    background-color: #4a148c;
    color: white;
    font-size: 0.9rem;
}

.charts-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 20px;
}

.chart-wrapper {
    background-color: #fff;
    padding: 15px;
    border-radius: 10px;
    width: 100%;
    margin-bottom: 20px;
}

canvas {
    width: 100%;
    height: 400px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.results-section {
    text-align: center;
    font-size: 0.85rem;
    color: #fff;
}

/* Responsividade para telas menores que 768px */
@media (max-width: 768px) {
    .container {
        padding: 15px;
    }

    .header-title {
        font-size: 1.4rem;
    }

    input {
        width: 100%;
        margin-bottom: 10px;
    }

    .input-section {
        flex-direction: column;
        align-items: flex-start;
    }

    button {
        width: 100%;
        padding: 10px;
    }

    table {
        font-size: 0.8rem;
    }

    canvas {
        height: 300px;
    }

    .logo-img {
        width: 80px;
    }

    .table-section, .charts-section {
        margin-bottom: 15px;
    }
}

/* Responsividade para telas menores que 480px */
@media (max-width: 480px) {
    .header-title {
        font-size: 1.2rem;
    }

    input, button {
        font-size: 0.8rem;
    }

    table {
        font-size: 0.7rem;
    }

    canvas {
        height: 250px;
    }

    .logo-img {
        width: 70px;
    }
}
