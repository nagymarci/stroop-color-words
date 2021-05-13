import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
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
    const [state, setState] = useState({words: getWords(), results: [{processed: 0, faults: 0}]})
    const [running, setRunning] = useState(false)
    const intervalId = useRef(null)
    const timerId = useRef(null)
    const [timer, setTimer] = useState({start: 0, time: 0})
    const [selection, setSelection] = useState({row: 0, col: 0, key: ""})



    useEffect(() => {
        for (let row = 0; row < state.words.length; row++) {
            for (let col = 0; col < state.words[row].length; col++) {
                if (!state.words[row][col].color) {
                    return
                }
                
            }
            
        }
        setRunning(false)
    }, [setRunning, state.words])

    const handleClick = useCallback((row, col) => {
        console.log("clicked", row, col)
        setState((old) => {
            let tmp = []
            old.words.forEach((wordRow, idx) => {
                tmp.push([])
                wordRow.forEach(word => {
                    tmp[idx].push({...word})
                });
            });
            let newResults = []
            old.results.forEach(result => {
                newResults.push({...result})
            })
            console.log("oldstate", tmp)
            console.log("oldstate at position", tmp[row][col])
            if (!tmp[row][col].color) {
                newResults[newResults.length-1].processed++
                console.log("assign green processed")
                tmp[row][col].color = "green"
            } else if (tmp[row][col].color === "red") {
                newResults[newResults.length-1].faults--
                console.log("assign green")
                tmp[row][col].color = "green"
            } else {
                newResults[newResults.length-1].faults++
                console.log("assign red")
                tmp[row][col].color = "red"
            }
            return {words: tmp, results: newResults}
        })
    },[setState])

    const handleSelectionChange = useCallback((row, col, key) => {
        console.log("clicked", row, col, key)
        setState((old) => {
            let tmp = []
            old.words.forEach((wordRow, idx) => {
                tmp.push([])
                wordRow.forEach(word => {
                    tmp[idx].push({...word})
                });
            });
            let newResults = []
            old.results.forEach(result => {
                newResults.push({...result})
            })
            console.log("oldstate", tmp)
            console.log("oldstate at position", tmp[row][col])
            if (!tmp[row][col].color && key === "ArrowRight") {
                newResults[newResults.length-1].processed++
                console.log("assign green processed")
                tmp[row][col].color = "green"
            } else if (key === "Enter"){
                if (!tmp[row][col].color) {
                    newResults[newResults.length-1].faults++
                    newResults[newResults.length-1].processed++
                    console.log("assign red")
                    tmp[row][col].color = "red"
                } else if (tmp[row][col].color === "red") {
                    newResults[newResults.length-1].faults--
                    console.log("assign green")
                    tmp[row][col].color = "green"
                } else {
                    newResults[newResults.length-1].faults++
                    console.log("assign red")
                    tmp[row][col].color = "red"
                }
            }
            return {words: tmp, results: newResults}
        })
    },[setState])

   useEffect(() => {
       console.log("selectionChanged effect")
        if (selection.col === 0 && selection.row !== 0) {
            handleSelectionChange(selection.row - 1, 4, selection.key)
        }
        if (selection.col !==0) {
            handleSelectionChange(selection.row, selection.col - 1, selection.key)
        }
    }, [selection, handleSelectionChange])

    useEffect(() => {
        function onKeyUp(e){
            if (e.code === "ArrowRight" || e.code === "Enter") {
                console.log(e.code)
                setSelection((old) => {
                    console.log("selectionChanged")
                    let newSelection = {...old}
                    newSelection.key = e.code
                    if (old.row === words.length) {
                        return old
                    }
                    if (old.col === 4) {
                        newSelection.col = 0
                        newSelection.row = old.row + 1
                    } else {
                        newSelection.col = old.col + 1
                        newSelection.row = old.row
                    }
                    return newSelection
                })
                e.preventDefault()
            }
            else if (e.code === "ArrowLeft") {
                console.log(e.code)
                setSelection((old) => {
                    console.log("selectionChanged")
                    let newSelection = {...old}
                    newSelection.key = e.code
                    if (old.col === 0 && old.row === 0) {
                        return old
                    }
                    if (old.col === 0) {
                        newSelection.col = 4
                        newSelection.row = old.row - 1
                    } else {
                        newSelection.col = old.col - 1
                        newSelection.row = old.row
                    }
                    return newSelection
                })
                e.preventDefault()
            }
            else {
                alert(e.code)
            }
            
        }
        window.addEventListener("keyup", onKeyUp)
        window.addEventListener("keypress", (e) => {
            if (e.code === "Enter") {
                e.preventDefault()
            }
        })
        return () => window.removeEventListener("keyup", onKeyUp)
    }, [])

    useEffect(() => {
        if (running && !intervalId.current) {
            intervalId.current = setInterval(()=> {
                setState((old) => {
                    let newResults = [...old.results]
                    newResults.push({processed: 0, faults: 0})
                    return {...old, results: newResults}
                })
            }, 20000)
            setTimer({
                    start: Date.now(),
                    time: 0
                })
            timerId.current = setInterval(() => {
                setTimer((old) => {
                    let tmp = {...old}
                    tmp.time = Date.now() - old.start
                    return tmp
                })
            }, 10)
        }
        if (!running && intervalId.current) {
            console.log("clear interval runnig")
            clearInterval(intervalId.current)
            clearInterval(timerId.current)
            intervalId.current = null
            timerId.current = null
        }
    }, [running])

    const handleStart = () => {
        if (!running) {
            setState({words: getWords(), results: [{processed: 0, faults: 0}]})
            setSelection({row: 0, col: 0, key: ""})
        }
        setRunning(!running)
    }
    //console.log("-----")
    //console.log(state)
    return (
        <Container className="colorWords">
            <Row className="mt-2">
                <Col>
            <Button onClick={handleStart}>{running ? "Leállitas" : "Indítás"}</Button>
            </Col>
            <Col>
                {("0" + (Math.floor(timer.time / 60000) % 60)).slice(-2)}:{("0" + (Math.floor(timer.time / 1000) % 60)).slice(-2)}
                </Col></Row>
            <Row className="mt-3">
                <Table bordered>
                    <tbody>
                        {state.words.map((row, idx) => {
                            return (
                                <tr>
                                    <td>{idx + 1}</td>
                                    {row.map((wordState, wdx) => {
                                        //console.log("wordState", wordState)
                                        return (
                                            <Word word={wordState.word} selected={selection.row === idx && selection.col === wdx} color={wordState.color} onClick={() => handleClick(idx, wdx)}/>
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
                <h2 className="mt-5">
                Össz idő: {("0" + (Math.floor(timer.time / 60000) % 60)).slice(-2)}:{("0" + (Math.floor(timer.time / 1000) % 60)).slice(-2)}
                </h2>
                <Table bordered className="resultTable">
                    <tbody>
                        <tr>
                            {state.results.map((v, idx) => {
                                return (
                                    <th>{idx+1}. 20mp</th>
                                )
                            })}
                        </tr>
                        <tr>
                            {state.results.map((result) => {
                                return (
                                    <td>{result.processed}</td>
                                )
                            })}
                        </tr>
                        <tr>
                            {state.results.map((result) => {
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
        //console.log("props", props)
        super(props)
        this.state={
            word: props.word,
            color: props.color,
            selected: props.selected
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                word: this.props.word,
                color: this.props.color,
                selected: this.props.selected
            })
        }
    }

    render() {
        //console.log("state", this.state)
        let color = !this.state.color ? "white" : this.state.color
        //console.log(color)
        return (
            <td className={this.state.selected ? "selected" : "default"} bgcolor={color} onClick={this.props.onClick}>{this.state.word}</td>
        )
    }
}