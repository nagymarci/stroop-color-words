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

export const ColorWords = () => {
    const [state, setState] = useState(getWords())
    const [running, setRunning] = useState(false)
    const intervalId = useRef(null)
    const [results, setResults] = useState([{processed: 0, faults: 0}])

    const handleClick = (row, col) => {
        console.log("clicked", row, col)
        let tmp = [...state]
        console.log(tmp)
        console.log(tmp[row][col])
        if (!tmp[row][col].color) {
            setResults((results) => {
                let newResults = [...results]
                newResults[newResults.length-1].processed++
                return newResults
            })
            tmp[row][col].color = "green"
        } else if (tmp[row][col].color === "red") {
            setResults((results) => {
                let newResults = [...results]
                newResults[newResults.length-1].faults--
                return newResults
            })
            tmp[row][col].color = "green"
        } else {
            setResults((results) => {
                let newResults = [...results]
                newResults[newResults.length-1].faults++
                return newResults
            })
            tmp[row][col].color = "red"
        }
        setState(tmp)
        checkFinish()
    }

    const checkFinish = () => {
        for (let row = 0; row < state.length; row++) {
            for (let col = 0; col < state[row].length; col++) {
                if (!state[row][col].color) {
                    return
                }
                
            }
            
        }
        setRunning(false)
    }

    useEffect(() => {
        if (running && !intervalId.current) {
            intervalId.current = setInterval(()=> {
                setResults((results) => {
                    let newResults = [...results]
                    newResults.push({processed: 0, faults: 0})
                    return newResults
                })
            }, 30000)
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
            setResults([{processed: 0, faults: 0}])
        }
        setRunning(!running)
    }
    console.log("-----")
    console.log(state)
    return (
        <Container className="colorWords">
            <Button onClick={handleTimer}>{running ? "Leállitas" : "Indítás"}</Button>
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