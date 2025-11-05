import React, { useState, useEffect } from 'react';
import { NStateSlider } from '../../shared/Util.js'
import { hexToFloat, floatToHex } from './IEEE754.js';

import './Resources.css'


const BinaryExplorer = () => {

    // const [inputValue, setInputValue] = useState('');
    const [unit, setUnit] = useState({
        decimal: '',
        hex: '',
        binary: '',
        ieee754: '',
    });
    const [valid, setValid] = useState({
        decimal: true,
        hex: true,
        binary: true,
        ieee754: true,
    })
    const [recent, setRecent] = useState({ field: "", updates: 0 }); // Most recent update
    const [floatPrec, setFloatprec] = useState('FP32');

    const resetValid = () => {
        setValid({
            decimal: true,
            hex: true,
            binary: true,
            ieee754: true,
        })
    }

    // Validation
    const isValidDecimal = (str) => {
        if (str === '') return false;
        str = str.replace(/\s/g, '')
        return /^-?\d*\.?\d+$/.test(str) && !isNaN(parseFloat(str));
    };

    const isValidHex = (str) => {
        if (str === '') return false;
        str = str.replace(/\s/g, '')

        // // Allow optional 0x prefix
        // // Then: one or more hex digits, optionally followed by a dot and one or more hex digits
        // const strictHexWithDotRegex = /^0x[0-9A-Fa-f]+(\.[0-9A-Fa-f]+)?$|^[0-9A-Fa-f]+(\.[0-9A-Fa-f]+)?$/;
        // return strictHexWithDotRegex.test(str);
        return /^0x[0-9A-Fa-f]+$/.test(str) || /^[0-9A-Fa-f]+$/.test(str);
    };

    const isValidBinary = (str) => {
        if (str === '') return false;
        str = str.replace(/\s/g, '')
        return /^0b[01]+(\.[01]+)?$/.test(str) || /^[01]+(\.[01]+)?$/.test(str); // Optional binary fractions
    };

    const isValidIEEE754 = (str) => {
        //if (str === '') return false;
        return isValidHex(str);
    };

    // Handle input change
    const handleDecimalChange = (e) => {
        const value = e.target.value;
        setValid(prev => ({ ...prev, decimal: isValidDecimal(value) }));
        setUnit(prev => ({ ...prev, decimal: value }));
        if (isValidDecimal(value)) setRecent({ field: "Decimal", updates: recent.updates + 1 });
    };

    const handleHexChange = (e) => {
        const value = e.target.value;
        setValid(prev => ({ ...prev, hex: isValidHex(value) }));
        setUnit(prev => ({ ...prev, hex: value }));
        if (isValidHex(value)) setRecent({ field: "Hex", updates: recent.updates + 1 });
    };

    const handleBinChange = (e) => {
        const value = e.target.value;
        setValid(prev => ({ ...prev, binary: isValidBinary(value) }));
        setUnit(prev => ({ ...prev, binary: value }));
        if (isValidBinary(value)) setRecent({ field: "Binary", updates: recent.updates + 1 });
    };

    const handleIEEE754Change = (e) => {
        const value = e.target.value;
        setValid(prev => ({ ...prev, ieee754: isValidIEEE754(value) }));
        setUnit(prev => ({ ...prev, ieee754: value }));
        if (isValidIEEE754(value)) setRecent({ field: "IEEE754", updates: recent.updates + 1 });
    };

    const handleIEEE754PrecChange = (prec) => {
        setFloatprec(prec);
        setRecent({ field: "IEEE754_Internal", updates: recent.updates + 1 });
    }

    useEffect(() => {
        let num = null;
        try {
            switch (recent.field) {
                case "IEEE754_Internal":
                case "Decimal":
                    num = Number(unit.decimal.replace(/\s/g, ''));
                    break;
                case "Hex":
                    let cleanedHex = unit.hex.startsWith('0x') ? unit.hex.slice(2) : unit.hex;
                    num = parseInt(cleanedHex.replace(/\s/g, ''), 16);
                    break;
                case "Binary":
                    let cleanedBin = unit.binary.startsWith('0b') ? unit.binary.slice(2) : unit.binary;
                    num = parseInt(cleanedBin.replace(/\s/g, ''), 2);
                    break;
                case "IEEE754":
                    num = Number(hexToFloat(unit.ieee754, floatPrec.toLowerCase()));
                
                default:
                    break;
            }
        } catch {

        }
        if (num != null) {

            const isFloat = !Number.isInteger(num);

            const decimal = isFloat ? num.toString() : num.toString();
            const hex = num >= 0 ? num.toString(16) : `-${(-num).toString(16)}`;
            const binaryStr = num >= 0 ? num.toString(2) : `-${(-num).toString(2)}`;
            const ieee754 = floatToHex(num, floatPrec.toLowerCase());
            
            resetValid();
            setUnit({
                decimal,
                hex,
                binary: binaryStr,
                ieee754,
            });

        }

    }, [recent])

    return (
        <div className="pill-container">
            <h2>Binary Explorer <div className="text-line" /></h2>

            {/* unit Grid */}
            <div className="unit-grid">
                <div className="unit-card">
                    <div className="adjustable-header space-between">
                        <h3>Decimal</h3>
                    </div>
                    <input type="text"
                        value={unit.decimal}
                        onChange={handleDecimalChange}
                        className={`explorer-input ${valid.decimal ? "" : "invalid-input"}`} />

                </div>

                <div className="unit-card">
                    <div className="adjustable-header space-between">
                        <h3>Hex</h3>
                    </div>
                    <input type="text"
                        value={unit.hex}
                        onChange={handleHexChange}
                        className={`explorer-input ${valid.hex ? "" : "invalid-input"}`} />

                </div>

                <div className="unit-card">
                    <div className="adjustable-header space-between">
                        <h3>Binary</h3>
                    </div>
                    <input type="text"
                        value={unit.binary}
                        onChange={handleBinChange}
                        className={`explorer-input ${valid.binary ? "" : "invalid-input"}`} />

                </div>

                <div className="unit-card">
                    <div className="adjustable-header space-between">
                        <h3>IEEE 754</h3>
                        <NStateSlider
                            value={floatPrec}
                            onChange={handleIEEE754PrecChange}
                            labels={['FP16', 'FP32', 'FP64']}
                        />
                    </div>
                    <input type="text"
                        value={unit.ieee754}
                        onChange={handleIEEE754Change}
                        maxLength={{
                            'FP16': 4,
                            'FP32': 8,
                            'FP64': 16,
                        }[floatPrec]}
                        className={`explorer-input ${valid.ieee754 ? "" : "invalid-input"}`} />
                    {/* 
                    {unit.ieee754Breakdown && (
                        <div className="breakdown">
                            <small>{unit.ieee754Breakdown}</small>
                        </div>
                    )} */}
                </div>

            </div>
        </div>
    );
};

export default BinaryExplorer;