import { NextApiRequest, NextApiResponse } from 'next';
import { Api, Routes } from '../../../../shared/utils';

const handleErrorCB = (res: NextApiResponse) => {
  res.status(500).json({ error: 'Internal Server Error' });
};

const handleSuccessCB = (res: NextApiResponse, response: any) => {
  res.status(200).json(response);
};

const bookSlot = (req: NextApiRequest, res: NextApiResponse) => {
  const { patientId, slotId } = req.body;

  const payload = {
    patient_id: patientId,
    slot_id: slotId,
  };

  const url = Routes.url('otp/patient/slot/');

  Api.create(
    url,
    payload,
    (response) => handleSuccessCB(res, response),
    () => handleErrorCB(res)
  );
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    bookSlot(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
