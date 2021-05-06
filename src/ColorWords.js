import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Row, Table } from 'react-bootstrap';
import words from './words.json';

function getWords() {
    return words.map((row) => {
        return row.map((word) => {
            return {
                word: word
            }
        })
    })
}

function calculateResult(state, setResults) {
    let clicked = 0
    let red = 0
    let tmp = [...state]
    tmp.forEach((row) => {
        row.forEach((wordState) => {
            if (wordState.color) {
                clicked++
            }
            if (wordState.color === "red") {
                red++
            }
        })
    })
    setResults((results) => {
        console.log("results", results)
        let newResults = [...results]
        let oldProcessed = 0
        let oldFaults = 0
        newResults.forEach((result) => {
            oldProcessed += result.processed
            oldFaults += result.faults
        })
        newResults.push({processed: clicked - oldProcessed, faults: red - oldFaults})
        return newResults
    })
}

export const ColorWords = () => {
    const [state, setState] = useState(getWords())
    const [running, setRunning] = useState(false)
    const intervalId = useRef(null)
    const [results, setResults] = useState([])

    const handleClick = (row, col) => {
        console.log("clicked", row, col)
        let tmp = [...state]
        console.log(tmp)
        console.log(tmp[row][col])
        if (!tmp[row][col].color || tmp[row][col].color === "red") {
            tmp[row][col].color = "green"
        } else {
            tmp[row][col].color = "red"
        }
        setState(tmp)
    }

    useEffect(() => {
        if (running && !intervalId.current) {
            intervalId.current = setInterval(()=> {
                calculateResult(state, setResults)
            }, 5000)
        }
        if (!running && intervalId.current) {
            console.log("clear interval runnig")
            clearInterval(intervalId.current)
            intervalId.current = null
        }
    }, [running, state])

    const handleTimer = () => {
        if (!running) {
            setState(getWords())
            setResults([])
        }
        setRunning(!running)
    }
    console.log("-----")
    console.log(state)
    return (
        <Container className="colorWords">
            <Button onClick={handleTimer}>{running ? "Stop" : "Start new"}</Button>
            <Row className="mt-5">
                <Table bordered>
                    <tbody>
                        {state.map((row, idx) => {
                            return (
                                <tr>
                                    <td>{idx + 1}</td>
                                    {row.map((wordState, wdx) => {
                                        console.log("wordState", wordState)
                                        return (
                                            <Word word={wordState.word} color={wordState.color} onClick={() => handleClick(idx, wdx)}/>
                                        )
                                    })}
                                </tr>
                            )
                        })}

                    </tbody>
                </Table>
            </Row>
            {!running &&
            <Row>
                <Table bordered className="resultTable">
                    <tbody>
                        <tr>
                            {results.map((v, idx) => {
                                return (
                                    <th>{idx+1}. perc</th>
                                )
                            })}
                        </tr>
                        <tr>
                            {results.map((result) => {
                                return (
                                    <td>{result.processed}</td>
                                )
                            })}
                        </tr>
                        <tr>
                            {results.map((result) => {
                                return (
                                    <td>{result.faults}</td>
                                )
                            })}
                        </tr>
                    </tbody>
                </Table>
            </Row>
            }
        </Container>
    )
}

class Word extends React.Component {
    constructor(props) {
        console.log("props", props)
        super(props)
        this.state={
            word: props.word,
            color: props.color
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                word: this.props.word,
                color: this.props.color
            })
        }
    }

    render() {
        console.log("state", this.state)
        let color = !this.state.color ? "white" : this.state.color
        console.log(color)
        return (
            <td bgcolor={color} onClick={this.props.onClick}>{this.state.word}</td>
        )
    }
}