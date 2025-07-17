import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/db'

export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params
    const members = await prisma.member.findMany({ where: { orgId } })
    res.json(members)
  } catch (err) {
    next(err)
  }
}

export const addMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params
    const { memberId, name, dob, phone, streetAddress, city, state, zipcode } = req.body
    const member = await prisma.member.create({
      data: {
        memberId,
        name,
        dob,
        phone,
        streetAddress,
        city,
        state,
        zipcode,
        orgId,
      },
    })
    res.status(201).json(member)
  } catch (err) {
    next(err)
  }
}