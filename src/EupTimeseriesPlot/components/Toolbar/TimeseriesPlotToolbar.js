import * as d3 from 'd3'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

// Import subcomponent
import { ArrowLeft, ArrowRight, CameraAlt, MoreVert } from '@mui/icons-material'
import {
  Checkbox,
  IconButton,
  ListItemButton,
  ListSubheader,
  Popover,
  Radio,
  RadioGroup,
  Toolbar,
  useTheme,
} from '@mui/material'
import { ToolbarIcon } from '../../../Commons/assets/ToolbarIcon'

/**
 * Uncomment below code in case EupWafermapBarSettingToolbar component is going to use formatted messages.
 */
import { useFormattedMessage } from '../../../../utils/LanguageSupport'

/**
 * - Display UI of the timeseries plot toolbar
 *
 * @export
 *
 * @param {Object} props - props of the component to render and update
 *
 */
const TimeseriesPlotToolbar = (props) => {
  // Variables declaration
  const {
    offsetHeight,
    setLoading,
    copyClipboardHandle,
    displayLimitHightLight,
    onChangeShowHightLight,
    valueRangeMode,
    onChangeValueRangeMode,
    handleRescale,
    fillColor,
    setFillColor,
    drawLines,
    handleChangeDrawLines,
    markerSize,
    handleMarkerSize,
  } = props

  const formattedMessage = useFormattedMessage()
  const theme = useTheme().palette
  const iconSize = 15

  // Component state
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const openToolbarMoreHandler = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const closeToolbarMoreHandler = () => {
    setAnchorEl(null)
  }

  const copyClipBoard = () => {
    setLoading(true)
    setTimeout(copyClipboardHandle, 1000)
  }

  useEffect(() => {
    d3.selectAll('.container')
      .select('#auto-scale-icon')
      .attr('width', iconSize + 2)
      .attr('height', iconSize + 2)
  }, [iconSize])

  return (
    <Toolbar
      role="toolbar"
      className="timeseries_toolbar"
      style={{
        minHeight: 0,
        backgroundColor: 'transparent',
        top: offsetHeight,
      }}
    >
      <IconButton onClick={handleRescale} sx={{ fontSize: `${iconSize}px` }}>
        <ToolbarIcon fill={theme.text.primary} />
      </IconButton>
      <IconButton data-testid="copyClipboard_btn" onClick={copyClipBoard}>
        <CameraAlt sx={{ fontSize: `${iconSize}px` }} />
      </IconButton>
      <IconButton className="button__more" onClick={openToolbarMoreHandler}>
        <MoreVert sx={{ fontSize: `${iconSize + 2}px` }} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        className="setting-popover"
        onClose={closeToolbarMoreHandler}
      >
        <ListSubheader role="heading">
          {formattedMessage('@EHSToolbar-hightlightOutsideLimits')}
        </ListSubheader>
        <ListItemButton
          role="checkbox"
          sx={{ paddingTop: '3px', paddingBottom: '3px' }}
          onClick={() => {
            onChangeShowHightLight(
              displayLimitHightLight === true ? false : true
            )
            setAnchorEl(false)
          }}
        >
          <Checkbox
            name="limitHightLight"
            checked={displayLimitHightLight}
            onChange={() => {
              onChangeShowHightLight(
                displayLimitHightLight === true ? false : true
              )
              setAnchorEl(false)
            }}
          />
          <span>{formattedMessage('@EHSToolbar-hightlightOutsideLimits')}</span>
        </ListItemButton>

        <ListSubheader role="heading">
          {formattedMessage('@EHSToolbar-SetDisplayRange')}
        </ListSubheader>
        <RadioGroup
          value={valueRangeMode}
          defaultValue={valueRangeMode}
          onChange={(e) => {
            onChangeValueRangeMode(e.target.value)
            setAnchorEl(false)
          }}
        >
          <ListItemButton
            role="radio"
            sx={{
              paddingTop: '3px',
              paddingBottom: '3px',
            }}
            onClick={() => {
              onChangeValueRangeMode('minMax')
              setAnchorEl(false)
            }}
          >
            <Radio
              value="minMax"
              label={formattedMessage('@ETToolbar-minMax')}
              name="MinOrMax"
            />
            <span>{formattedMessage('@ETToolbar-minMax')}</span>
          </ListItemButton>
          <ListItemButton
            role="radio"
            sx={{
              paddingTop: '3px',
              paddingBottom: '3px',
            }}
            onClick={() => {
              onChangeValueRangeMode('limit')
              setAnchorEl(false)
            }}
          >
            <Radio
              value="limit"
              label={formattedMessage('@ETToolbar-limit')}
              name="LowHighLimit"
            />
            <span>{formattedMessage('@ETToolbar-limit')}</span>
          </ListItemButton>
        </RadioGroup>

        <ListSubheader role="heading">
          {formattedMessage('@ETToolbar-drawLines')}
        </ListSubheader>
        <ListItemButton
          role="checkbox"
          sx={{ paddingTop: '3px', paddingBottom: '3px' }}
          onClick={() => {
            handleChangeDrawLines(drawLines === true ? false : true)
            setAnchorEl(false)
          }}
        >
          <Checkbox
            name="drawLines"
            checked={drawLines}
            onChange={() => {
              handleChangeDrawLines(drawLines === true ? false : true)
              setAnchorEl(false)
            }}
          />
          <span>{formattedMessage('@ETToolbar-drawLines')}</span>
        </ListItemButton>

        <ListSubheader role="heading">
          {formattedMessage('@ETToolbar-marker')}
        </ListSubheader>
        <ListItemButton
          role="checkbox"
          sx={{ paddingTop: '3px', paddingBottom: '3px' }}
          onClick={() => {
            setFillColor(fillColor === true ? false : true)
            setAnchorEl(false)
          }}
        >
          <Checkbox
            name="fillColor"
            checked={fillColor}
            onChange={() => {
              setFillColor(fillColor === true ? false : true)
              setAnchorEl(false)
            }}
          />
          <span>{formattedMessage('@ETToolbar-marker')}</span>
        </ListItemButton>

        <ListSubheader role="heading">
          {formattedMessage('@ETToolbar-markerSize')}
        </ListSubheader>
        <ListItemButton
          role="input"
          sx={{ paddingTop: '3px', paddingBottom: '3px' }}
        >
          <IconButton
            size="small"
            onClick={() => {
              if (markerSize > 1) {
                handleMarkerSize(markerSize - 10)
              }
            }}
          >
            <ArrowLeft />
          </IconButton>
          <span
            style={{
              padding: '0 8px',
            }}
          >
            {markerSize / 10}px
          </span>
          <IconButton
            size="small"
            onClick={() => {
              handleMarkerSize(markerSize + 10)
            }}
          >
            <ArrowRight />
          </IconButton>
        </ListItemButton>
      </Popover>
    </Toolbar>
  )
}

TimeseriesPlotToolbar.propTypes = {
  offsetHeight: PropTypes.number,
  setLoading: PropTypes.any,
  copyClipboardHandle: PropTypes.func,
  displayLimitHightLight: PropTypes.bool,
  onChangeShowHightLight: PropTypes.func,
  valueRangeMode: PropTypes.string,
  onChangeValueRangeMode: PropTypes.func,
  handleRescale: PropTypes.func,
  fillColor: PropTypes.bool,
  setFillColor: PropTypes.any,
  drawLines: PropTypes.bool,
  handleChangeDrawLines: PropTypes.any,
  markerSize: PropTypes.number,
  handleMarkerSize: PropTypes.any,
}
export default TimeseriesPlotToolbar
