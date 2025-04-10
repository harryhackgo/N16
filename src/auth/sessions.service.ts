import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Request } from "express";
import { UAParser } from "ua-parser-js";


@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async createSession(req: Request,  userId: number) {
    const uaParser = new UAParser();
    const userAgent = req.headers['user-agent'] || '';
    uaParser.setUA(userAgent);
    const deviceInfo = uaParser.getResult()
    const ipAddress = req.ip || ''

    console.log(deviceInfo, ipAddress, req.ip, req.ips, req.headers['user-agent'])

    const session = await this.prisma.sessions.create({
      data: {
        userId: userId,
        device: `${deviceInfo.device.model} ${deviceInfo.os.name} ${deviceInfo.browser.name}`, 
        ipAddress: ipAddress,
      }
    })

    return session
  }

  async getSessions(userId: number) {
    const sessions = await this.prisma.sessions.findMany({
      where: {
        userId: userId
      }
    })

    return sessions
  }
  async deleteSession(sessionId: number) {
    const session = await this.prisma.sessions.delete({
      where: {
        id: sessionId
      }
    })

    return session
  }
  async deleteAllSessions(userId: number) {
    const sessions = await this.prisma.sessions.deleteMany({
      where: {
        userId: userId
      }
    })

    return sessions
  }
  async getSession(sessionId: number) { 
    const session = await this.prisma.sessions.findUnique({
      where: {
        id: sessionId
      }
    })

    return session
  }
  async getSessionByUserId(userId: number) {  
    const session = await this.prisma.sessions.findMany({
      where: {
        userId: userId
      }
    })

    return session
  }
}