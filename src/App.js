import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import { AutoSizer, Column, Table } from "react-virtualized";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
const baseStyle = theme => ({
    root: {
        padding: 16
    },
    head: {
        margin: 16,
        fontSize: 24
    }
});

const styles = theme => ({
    flexContainer: {
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box"
    },
    tableRow: {
        cursor: "pointer"
    },
    tableRowHover: {
        "&:hover": {
            backgroundColor: theme.palette.grey[200]
        }
    },
    tableCell: {
        flex: 1
    },
    noClick: {
        cursor: "initial"
    },
    header: {
        background: 'black',
        color: 'white'
    },
    cell: {
        '& tr:nth-child(even)' : {
            background: '#f2f2f2'
        }
    }
});

class MuiVirtualizedTable extends React.PureComponent {
    static defaultProps = {
        headerHeight: 48,
        rowHeight: 48
    };

    getRowClassName = ({ index }) => {
        const { classes, onRowClick } = this.props;

        return clsx(classes.tableRow, classes.flexContainer, {
            [classes.tableRowHover]: index !== -1 && onRowClick != null
        });
    };

    cellRenderer = ({ cellData, columnIndex }) => {
        const { columns, classes, rowHeight, onRowClick } = this.props;
        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, classes.cell, {
                    [classes.noClick]: onRowClick == null
                })}
                variant="body"
                style={{ height: rowHeight }}
                align={
                    (columnIndex != null && columns[columnIndex].numeric) ||
                    false
                        ? "right"
                        : "left"
                }
            >
                {cellData}
            </TableCell>
        );
    };

    headerRenderer = ({ label, columnIndex }) => {
        const { headerHeight, columns, classes } = this.props;

        return (
            <TableCell
                component="div"
                className={clsx(
                    classes.tableCell,
                    classes.flexContainer,
                    classes.noClick,
                    classes.header
                )}
                variant="head"
                style={{ height: headerHeight }}
                align={columns[columnIndex].numeric || false ? "right" : "left"}
            >
                <span>{label}</span>
            </TableCell>
        );
    };

    render() {
        const { classes, columns, ...tableProps } = this.props;

        return (
            <AutoSizer>
                {({ height, width }) => (
                    <Table
                        height={height}
                        width={width}
                        {...tableProps}
                        rowClassName={this.getRowClassName}
                    >
                        {columns.map(({ dataKey, ...other }, index) => {
                            return (
                                <Column
                                    key={dataKey}
                                    headerRenderer={headerProps =>
                                        this.headerRenderer({
                                            ...headerProps,
                                            columnIndex: index
                                        })
                                    }
                                    className={classes.flexContainer}
                                    cellRenderer={this.cellRenderer}
                                    dataKey={dataKey}
                                    {...other}
                                />
                            );
                        })}
                    </Table>
                )}
            </AutoSizer>
        );
    }
}

MuiVirtualizedTable.propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    headerHeight: PropTypes.number,
    onRowClick: PropTypes.func,
    rowHeight: PropTypes.number
};

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

// ---

class ReactVirtualizedTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.getRows = this.getRows.bind(this);
        this.getLength = this.getLength.bind(this);
    }
    componentDidMount() {
        axios
            .get("/countries")
            .then(res => {
                let extractedResult = res.data.map(country => {
                    return Object.values(country);
                });

                function createData(
                    id,
                    country,
                    capitalcity,
                    population,
                    area
                ) {
                    return { id, country, capitalcity, population, area };
                }

                const rows = [];

                for (let i = 0; i < 250; i += 1) {
                    //const randomSelection = sample[Math.floor(Math.random() * sample.length)];
                    rows.push(createData(i, ...extractedResult[i]));
                }
                this.setState({
                    data: rows
                });
            })
            .catch(err => console.log(err));
    }
    helper(state) {
        return state;
    }
    getRows(index) {
        let status = this.helper(this.state);
        return status.data;
    }
    getLength(state) {
        return state.data.length;
    }
    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.root}>
                <CardContent>
                    <Grid
                        container
                        justify="center"
                        alignContent="center"
                        alignItems="center"
                        spacing={32}
                    >
                        <Grid item xs={12} md={6}>
                            <Paper
                                style={{
                                    height: 400,
                                    width: "100%",
                                    overflow: "hidden",
                                    background: "#eceff1"
                                }}
                            >
                                <Typography
                                    className={classes.head}
                                    variant="h1"
                                >
                                    COUNTRIES DATA
                                </Typography>
                                <VirtualizedTable
                                    rowCount={this.getLength(this.state)}
                                    rowGetter={({ index }) =>
                                        this.getRows()[index]
                                    }
                                    columns={[
                                        {
                                            width: 200,
                                            label: "Country",
                                            dataKey: "country"
                                        },
                                        {
                                            width: 120,
                                            label: "Capital City",
                                            dataKey: "capitalcity",
                                            numeric: false
                                        },
                                        {
                                            width: 120,
                                            label: "Population",
                                            dataKey: "population",
                                            numeric: true
                                        },
                                        {
                                            width: 120,
                                            label: "Area",
                                            dataKey: "area",
                                            numeric: true
                                        }
                                    ]}
                                />
                            </Paper>
                            <Paper  style={{
                                marginTop: 14, padding: "16"
                            }} >
                                <Typography variant="h6">Welcome</Typography>
                                <Typography>
                                    This site shows data extracted from
                                    <a href="https://scrapethissite.com/pages/simple/">
                                         {" this site. "}
                                    </a>
                                    The data was obtained with puppeteer and
                                    presented on this website using{" "}
                                    <a href="reactjs.org"> reactjs</a> and{" "}
                                    <a href="material-ui.com"> material-ui.</a>
                                </Typography>
                                <Typography variant="subtitle1" color="secondary" >
                                    Code for the app can be accessed at <a href="https://github.com/Evans-Okerosi/country-data-scrapper">
                                        Country-data-scrapper
                                    </a>
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(baseStyle)(ReactVirtualizedTable);
