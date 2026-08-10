// Generates token, sets cookie, and sends the response with sanitized user data
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  const userSafe = {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    phone: user.phone,
    address: user.address,
    profileImage: user.profileImage,
    role: user.role,
    createdAt: user.createdAt
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token, user: userSafe });
};

module.exports = sendTokenResponse;
