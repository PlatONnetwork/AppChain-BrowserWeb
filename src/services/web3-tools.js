const getAccounts = async () => {
  if (!window.ethereum) return ''
  const [address] = await ethereum.request({ method: 'eth_requestAccounts' })
  return address
}

export { getAccounts }
