import { NextApiRequest, NextApiResponse } from 'next';
import { Api, Routes } from '../../../../shared/utils';

const handleErrorCB = (res: NextApiResponse) => {
  res.status(500).json({ error: 'Internal Server Error' });
};

const handleSuccessCB = (res: NextApiResponse, response: any) => {
  res.status(200).json(response);
};

const generateOtpToken = (req: NextApiRequest, res: NextApiResponse) => {
  const { phone_number } = req.body;

  const payload = {
    phone_number: `+91${phone_number}`,
  };

  const url = Routes.url('otp/token/');

  Api.create(
    url,
    payload,
    (response) => handleSuccessCB(res, response),
    () => handleErrorCB(res)
  );
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    generateOtpToken(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
