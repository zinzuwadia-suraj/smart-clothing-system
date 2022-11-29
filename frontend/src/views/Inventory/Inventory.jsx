import React, { useState, useEffect } from 'react';
import * as uuid from 'device-uuid';
import { CircularProgress, Box, Grid, Typography, lighten } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { PrivateWrapper } from '../../components/layouts';
import useToastr from '../../hooks/useToastr';
import { RoutePaths } from '../../configs';
import InventoryInfoCard from '../../components/inventory/InventoryInfoCard';
import { getOverview } from '../../api/Clothes';

const DEVICE_ID = new uuid.DeviceUUID().get();

const InventoryStats = () => {
  const pageName = 'Inventory Stats';
  const { showErrorToastr } = useToastr();

  const [rows, setRows] = useState([]);
  const [dataLoadError, setDataLoadError] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    setDataLoaded(false);
    setDataLoadError('');
    getOverview(DEVICE_ID)
      .then((data) => {
        setRows(data?.userOverview || []); // TODO: delete static data later
        setDataLoaded(true);
      })
      .catch(({ response }) => {
        setRows([]);
        setDataLoadError(response?.data || 'Something went wrong.');
        showErrorToastr('Error fetching data. Please refresh the page.');
        setDataLoaded(true);
      });
  }, []);

  if (!dataLoaded) {
    return (
      <PrivateWrapper pageName={pageName}>
        <Box p={5} display="flex" height="90vh" alignItems="center" justifyContent="center">
          {dataLoadError || <CircularProgress size={25} />}
        </Box>
      </PrivateWrapper>
    );
  }

  if (dataLoaded && rows.length === 0) {
    return (
      <PrivateWrapper pageName={pageName}>
        <Box p={5} display="flex" height="90vh" alignItems="center" justifyContent="center">
          <Box
            display="flex"
            sx={{
              p: 4,
              backgroundColor: (theme) => lighten(theme.palette.error.main, 0.8),
              color: (theme) => theme.palette.error.main,
            }}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <WarningIcon fontSize="large" />
            <Typography variant="h5">Whoops!</Typography>
            <Typography variant="body">
              It seems like no users has been added into the system. Please create user profile to
              manage their inventories.
            </Typography>
          </Box>
        </Box>
      </PrivateWrapper>
    );
  }

  return (
    <PrivateWrapper pageName={pageName}>
      <Grid container sx={{ p: 2 }} spacing={2}>
        {rows.map((r) => (
          <Grid key={r.username} item>
            <InventoryInfoCard
              heading={r.username}
              totalClothes={r['Unwashed cloths'] + r['Washed cloths'] || '0'}
              washedClothes={r['Washed cloths'] || '0'}
              unwashedClothes={r['Unwashed cloths'] || '0'}
              link={RoutePaths.USER_INVENTORY.replace(':uID', r.uID)}
            />
          </Grid>
        ))}
      </Grid>
    </PrivateWrapper>
  );
};

export default InventoryStats;
