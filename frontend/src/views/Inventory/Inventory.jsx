import React, { useState, useEffect } from 'react';
import * as uuid from 'device-uuid';
import { CircularProgress, Box, Grid } from '@mui/material';
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

  return (
    <PrivateWrapper pageName={pageName}>
      <Grid container sx={{ p: 2 }} spacing={2}>
        {rows.map((r) => (
          <Grid key={r.username} item>
            <InventoryInfoCard
              heading={r.username}
              totalClothes={r['Unwashed cloths'] + r['Washed cloths'] || 'NA'}
              washedClothes={r['Washed cloths'] || 'NA'}
              unwashedClothes={r['Unwashed cloths'] || 'NA'}
              link={RoutePaths.USER_INVENTORY.replace(':uID', r.uID)}
            />
          </Grid>
        ))}
      </Grid>
    </PrivateWrapper>
  );
};

export default InventoryStats;
