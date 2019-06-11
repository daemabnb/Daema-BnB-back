const getRequest = async (uri: string): Promise<Response> => {
  try {
    const init: RequestInit = {
      method: 'GET'
    }

    return await fetch(uri, init)
  } catch (error) {
    throw new Error(error)
  }
}

export { getRequest }
