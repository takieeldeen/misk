'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import Grid from '@mui/material/Unstable_Grid2';
import {
  Card,
  Stack,
  Accordion,
  Container,
  Typography,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Form, RHFTextField } from 'src/components/hook-form';
import { RHFEditor } from 'src/components/hook-form/rhf-editor';
import { RHFUpload } from 'src/components/hook-form/rhf-upload';

function ProductNewEditForm() {
  const form = useForm();
  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <Form methods={form}>
        <Stack sx={{ mb: 2 }}>
          <Typography variant="h4">Create New Product</Typography>
        </Stack>
        <Card>
          <Accordion>
            <AccordionSummary
              sx={{ px: 3 }}
              title="Basic Information"
              expandIcon={<Iconify icon="majesticons:chevron-up" />}
            >
              <Stack spacing={0.5}>
                <Typography variant="h6">Basic Information</Typography>
                <Typography variant="body2" color="text.secondary">
                  Title, short description, image...
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: 1, borderColor: 'divider', py: 3 }}>
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <Stack spacing={1}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>Arabic Name</Typography>
                    <RHFTextField name="nameAr" placeholder="Arabic Name" />
                  </Stack>
                </Grid>
                <Grid xs={12} md={6}>
                  <Stack spacing={1}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>English Name</Typography>
                    <RHFTextField name="nameEn" placeholder="English Name" />
                  </Stack>
                </Grid>
                <Grid xs={12} md={12}>
                  <Stack spacing={1}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                      Arabic Description
                    </Typography>
                    <RHFTextField
                      multiline
                      rows={4}
                      name="descriptionAr"
                      placeholder="Arabic Description"
                    />
                  </Stack>
                </Grid>
                <Grid xs={12} md={12}>
                  <Stack spacing={1}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                      English Description
                    </Typography>
                    <RHFTextField
                      multiline
                      rows={4}
                      name="descriptionEn"
                      placeholder="English Description"
                    />
                  </Stack>
                </Grid>
                <Grid xs={12} md={12}>
                  <Stack spacing={1}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>Content</Typography>
                    <RHFEditor name="content" />
                  </Stack>
                </Grid>
                <Grid xs={12} md={12}>
                  <Stack spacing={1}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>Images</Typography>
                    <RHFUpload name="images" />
                  </Stack>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>
      </Form>
    </Container>
  );
}

export default ProductNewEditForm;
