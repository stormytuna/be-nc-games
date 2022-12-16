exports.make400 = (moreInfo) => {
	return Promise.reject({
		status: 400,
		msg: "Bad request",
		moreInfo: moreInfo
	});
};

exports.make404 = (moreInfo) => {
	return Promise.reject({
		status: 404,
		msg: "Content not found",
		moreInfo: moreInfo
	});
};
