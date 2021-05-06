import React from 'react';
import { Container, Row, Table } from 'react-bootstrap';
import words from './words.json';

export const ColorWords = () => {
    return (
        <Container className="colorWords">
            <Row className="mt-5">
                <Table bordered>
                    <tbody>
                        {words.map((row, idx) => {
                            return (
                                <tr>
                                    <td>{idx + 1}</td>
                                    {row.map((word) => {
                                        return (
                                            <td>
                                                {word}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Row>
        </Container>
    )
}