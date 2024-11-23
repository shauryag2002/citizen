import { NextApiRequest, NextApiResponse } from 'next';
import { Api, Routes } from '../../../../shared/utils';

const handleErrorCB = (res: NextApiResponse) => {
  res.status(500).json({ error: 'Internal Server Error' });
};

const handleSuccessCB = (res: NextApiResponse, response: any) => {
  res.status(200).json(response);
};

const manageAbhaProfile = (req: NextApiRequest, res: NextApiResponse) => {
  const { id, profile } = req.body;

  const payload = {
    profile,
  };

  const url = Routes.url(`otp/patient/${id}/abha/`);

  Api.update(
    url,
    payload,
    (response) => handleSuccessCB(res, response),
    () => handleErrorCB(res)
  );
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    manageAbhaProfile(req, res);
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
