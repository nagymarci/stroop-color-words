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
                console.log("results", results)
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
                let newResults = [...results]
                newResults.push({processed: clicked, faults: red})
                setResults(newResults)
            }, 5000)
        }
        if (!running && intervalId.current) {
            clearInterval(intervalId.current)
            intervalId.current = null
        }
    }, [running, results, state])

    const handleTimer = () => {
        if (running) {
            setState(getWords())
            setResults([])
        }
        setRunning(!running)
    }
    console.log("-----")
    console.log(state)
    return (
        <Container className="colorWords">
            <Button onClick={handleTimer}>{running ? "New" : "Start"}</Button>
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
            {results.map((value) => {
                return (
                    <p>
                    {value.processed} {value.faults}
                    </p>
                )
            })}
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