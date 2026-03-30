#!/usr/bin/env python
import sys
import os


sys.path.insert(0, os.path.dirname(__file__))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
