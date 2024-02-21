import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database/mongo.config";
import { registerSchema } from "@/validator/authValidationSchema";
import vine, { errors } from "@vinejs/vine";
import ErrorReporter from "@/validator/ErrorReporter";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/models/authModel";

interface UserPayload {
  name: string;
  email: string;
  password: string;
  avtar?: string;
}

connect();
export async function POST(request: NextRequest) {
  try {
    const body: UserPayload = await request.json();
    vine.errorReporter = () => new ErrorReporter();
    const validator = vine.compile(registerSchema);
    const output = await validator.validate(body);
    try {
      const user = await LoginSchema.findOne({ email: output.email });
      if (user) {
        return NextResponse.json(
          {
            status: 400,
            errors: {
              email: "Email is already used.",
            },
          },
          { status: 200 }
        );
      } else {

        let cyear = new Date();
        const ThisYear = cyear.getFullYear();

        const maxrollNumberPerson = await LoginSchema.find({})
          .sort({ rollnumber: -1 })
          .limit(1)
          .then((goods: any) => goods[0].rollnumber);

        let newRollnumber = maxrollNumberPerson + 1 || 0;

        // * To Hash the password

        const salt = bcrypt.genSaltSync(12);
        const hashedPassword = bcrypt.hashSync(output.password, salt);
        await LoginSchema.create({
          email: output.email,
          name: output.name,
          password: hashedPassword,
          account_type: "Student",
          allowed_roles: ["Student"],
          rollyear: ThisYear,
          rollnumber: newRollnumber,
          rollclass: "GSTU",
          batch: "GStudent",
        });
        return NextResponse.json(
          { status: 200, msg: "User Created successfully!" },
          { status: 200 }
        );
      }
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json(
        { status: 400, errors: error.messages },
        { status: 200 }
      );
    }
  }
}
