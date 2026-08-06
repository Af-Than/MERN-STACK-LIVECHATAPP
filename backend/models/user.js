const mongoose=require("mongoose");

const messageSchema=mongoose.Schema(
{
    name:
    {
        type:String,
        required:true
    },
    email:
    {
        type:String,
        required:true
    },
    password:
    {
        type:String,
        required:true
    },
    pic:{
        type:String,
        required:true,
        default:"https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U"
    }

},
{
    timestamps:true
}
)