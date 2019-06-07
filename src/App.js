import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles, createStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import { AutoSizer, Column, Table } from "react-virtualized";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";

const baseStyle = makeStyles( theme=>({
    root: {
      padding: 32  
    }
}));

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
                className={clsx(classes.tableCell, classes.flexContainer, {
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
                    classes.noClick
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
        const classes = baseStyle();
        return (
            <Paper className={classes.root} >
                <Grid
                    container
                    justify="center"
                    alignContent="center"
                    alignItems="center"
                    
                    spacing={32}
                >
                    <Grid item xs={12} md={6}>
                        <Paper style={{ height: 400, width: "100%" }}>
                            <Typography>COUNTRIES DATA</Typography>
                            <VirtualizedTable
                                rowCount={this.getLength(this.state)}
                                rowGetter={({ index }) => this.getRows()[index]}
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
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default ReactVirtualizedTable;
