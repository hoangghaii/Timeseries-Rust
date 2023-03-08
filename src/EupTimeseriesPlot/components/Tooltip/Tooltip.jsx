import React from 'react'
import { Box, Divider, Grid, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import './Tooltip.scss'

const Tooltip = ({ data }) => {
  return (
    <>
      {data?.map((x, index) => (
        <Box key={index}>
          <Box className="tooltipbox-wrapper">
            <Grid
              container
              spacing={6}
              wrap="nowrap"
              className="grid-tooltipbox-container"
            >
              <Grid item xs={4} className="grid-box-item-keyname">
                <Typography
                  variant="button"
                  className="typography-keyname"
                  style={{
                    fontStyle: `${
                      x.keyName['isFromData'] ? 'italic' : 'initial'
                    }`,
                  }}
                >
                  {x.keyName['name']}
                </Typography>
              </Grid>
              <Grid item xs className="grid-box-item-valuename">
                <Typography variant="button" className="typography-valuename">
                  {x.valueName}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          {index !== data.length - 1 && <Divider />}
        </Box>
      ))}
    </>
  )
}

// Argument Description
Tooltip.propTypes = {
  /**
   * content list
   */
  data: PropTypes.array.isRequired,
}

Tooltip.defaultProps = {
  data: [],
}

export default Tooltip
