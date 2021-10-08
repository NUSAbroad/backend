const handleError = (err: Error) => {
  const { name, message } = err;

  return {
    name,
    message
  };
};

export { handleError };
