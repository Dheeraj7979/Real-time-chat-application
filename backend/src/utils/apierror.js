class Apierror extends Error{
     constructor(status=400,message="something went wrong"){
          super(message)
          this.status=status
     }
}

export {Apierror}