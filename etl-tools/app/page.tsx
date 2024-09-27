"use client";

import { useState } from "react";

import * as React from "react"

import { Button } from "@/components/ui/button"

import { Spinner } from "@/components/ui/spinner"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"

export default function Home() {

  const [mongoHost, setMongoHost] = useState("");
  const [mongoPort, setMongoPort] = useState("");
  const [mongoDatabase, setMongoDatabase] = useState("");
  const [mongoUser, setMongoUser] = useState("");
  const [mongoPassword, setMongoPassword] = useState("");

  const [rdbmsType, setRdbmsType] = useState("")
  const [rdbmsHost, setRdbmsHost] = useState("");
  const [rdbmsPort, setRdbmsPort] = useState("");
  const [rdbmsDatabase, setRdbmsDatabase] = useState("");
  const [rdbmsUser, setRdbmsUser] = useState("");
  const [rdbmsPassword, setRdbmsPassword] = useState("");

  const [mongoMessage, setMongoMessage] = useState({text: "", success: false});
  const [rdbmsMessage, setRdbmsMessage] = useState({text: "", success: false});

  const [show, setShow] = useState(false)

  const [loadingMessage, setLoadingMessage] = useState({text: "Schema creation is in progress", success: false});
  const [schemaMessage, setSchemaMessage] = useState({text: "", success: false});
  const [etlMessage, setEtlMessage] = useState({text: "", success: false});

  const handleSubmit = async (tab: string) => {
    let valid = true;
    let response, result;
    switch (tab) {
      case "MongoDB":
        if (!mongoHost || !mongoPort || !mongoDatabase || !mongoUser || !mongoPassword) {
          valid = false;
          alert("Please fill in all required fields for MongoDB.");
        }
        if (valid) {
          try {
            response = await fetch("http://localhost:8000/mongo-test-connection", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ host: mongoHost, port: mongoPort, database: mongoDatabase, user: mongoUser, password: mongoPassword }),
            });
            result = await response.json();
            setMongoMessage({
              ...mongoMessage,
              text: result.message, 
              success: result.success});
          } catch (error) {
            setMongoMessage({
              ...mongoMessage,
              text: "Error connecting to MongoDB", 
              success: false});
          }
        }
        break;
      case "RDBMS":
        if (!rdbmsType || !rdbmsHost || !rdbmsPort || !rdbmsDatabase || !rdbmsUser || !rdbmsPassword) {
          valid = false;
          alert("Please fill in all required fields for RDBMS.");
        }
        if (valid) {
          try {
            response = await fetch("http://localhost:8000/postgre-test-connection", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ type: rdbmsType, host: rdbmsHost, port: rdbmsPort, database: rdbmsDatabase, user: rdbmsUser, password: rdbmsPassword }),
            });
            result = await response.json();
            setRdbmsMessage({
              ...rdbmsMessage,
              text: result.message, 
              success: result.success});
          } catch (error) {
            setRdbmsMessage({
              ...rdbmsMessage,
              text: "connection failed", 
              success: false});
          }
        }
        break;
      case "TransformSchema":
        if (!mongoHost || !mongoPort || !mongoDatabase || !mongoUser || !mongoPassword || !rdbmsType || !rdbmsHost || !rdbmsPort || !rdbmsDatabase || !rdbmsUser || !rdbmsPassword) {
          valid = false;
          alert("Please fill in all required fields for PostgreSQL.");
        }
        if (valid) {
          try {
            response = await fetch("http://localhost:8000/generate-schema-from-mongo-to-postgres", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                mongo_host: mongoHost,
                mongo_port: mongoPort,
                mongo_database: mongoDatabase,
                mongo_user: mongoUser,
                mongo_password: mongoPassword,
                rdbms_type: rdbmsType, 
                postgre_host: rdbmsHost, 
                postgre_port: rdbmsPort, 
                postgre_database: rdbmsDatabase, 
                postgre_user: rdbmsUser, 
                postgre_password: rdbmsPassword
                
              }),
            });
            result = await response.json();
            setShow((pre) => !pre);
            setSchemaMessage({
              ...schemaMessage,
              text: result.message, 
              success: result.success});
          } catch (error) {
            setShow((pre) => !pre);
            setSchemaMessage({
              ...schemaMessage,
              text: result.message, 
              success: false});
          }
        }
        break;
      default:
        break;
    }
  };

  return (

    <div className="w-full h-screen flex justify-center mt-40">
      <div>
        <Tabs defaultValue="MongoDB" className="w-[400px]">
          <TabsList className="w-full">
            <TabsTrigger value="MongoDB">MongoDB</TabsTrigger>
            <TabsTrigger value="RDBMS">RDBMS</TabsTrigger>
            <TabsTrigger value="Evaluate">Evaluate</TabsTrigger>
          </TabsList>

          <TabsContent value="MongoDB" className="h-80">
            <Card>
                <CardHeader>
                  <CardTitle>MongoDB</CardTitle>
                  <CardDescription>
                    Configuration for MongoDB Source
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="mongo-host">Host</Label>
                    <Input id="mongo-host" placeholder="localhost" value={mongoHost} onChange={(e) => setMongoHost(e.target.value)} required/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="mongo-port">Port</Label>
                    <Input id="mongo-port" placeholder="27017" value={mongoPort} onChange={(e) => setMongoPort(e.target.value)} required/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="mongo-database">DB</Label>
                    <Input id="mongo-database" placeholder="my-db" value={mongoDatabase} onChange={(e) => setMongoDatabase(e.target.value)} required/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="mongo-user">Username</Label>
                    <Input id="mongo-user" placeholder="admin" value={mongoUser} onChange={(e) => setMongoUser(e.target.value)} required/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="mongo-password">Password</Label>
                    <Input id="mongo-password" type="password" placeholder="******" value={mongoPassword} onChange={(e) => setMongoPassword(e.target.value)} required/>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSubmit("MongoDB")}>Save & Test Connection</Button>
                  {mongoMessage.text && <div className={mongoMessage.success ? "text-green-600 text-sm font-semibold ml-2" : "text-red-600 text-sm font-semibold ml-2"}>{mongoMessage.text}</div>}
                </CardFooter>
              </Card>
            </TabsContent>
          
          <TabsContent value="RDBMS" className="h-80">
            <Card>
              <CardHeader>
                <CardTitle>RDBMS</CardTitle>
                <CardDescription>
                  Configuration for RDBMS Destination
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">

                <div className="space-y-1">
                  <Label htmlFor="rdbms-type">Type</Label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select your RDBMS" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="mysql">MySQL</SelectItem>
                        <SelectItem value="postgresql">PostgreSQL</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="rdbms-host">Host</Label>
                  <Input id="rdbms-host" placeholder="localhost" value={rdbmsHost} onChange={(e) => setRdbmsHost(e.target.value)} required/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="rdbms-port">Port</Label>
                  <Input id="rdbms-port" placeholder="5432" value={rdbmsPort} onChange={(e) => setRdbmsPort(e.target.value)} required/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="postgre-database">DB</Label>
                  <Input id="rdbms-database" placeholder="my-db" value={rdbmsDatabase} onChange={(e) => setRdbmsDatabase(e.target.value)} required/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="rdbms-user">Username</Label>
                  <Input id="rdbms-user" placeholder="admin" value={rdbmsUser} onChange={(e) => setRdbmsUser(e.target.value)} required/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="rdbms-password">Password</Label>
                  <Input id="rdbms-password" type="password" placeholder="******" value={rdbmsPassword} onChange={(e) => setRdbmsPassword(e.target.value)} required/>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSubmit("RDBMS")}>Save & Test Connection</Button>
                {rdbmsMessage.text && <div className={rdbmsMessage.success ? "text-green-600 text-sm font-semibold ml-2" : "text-red-600 text-sm font-semibold ml-2"}>{rdbmsMessage.text}</div>}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="Evaluate" className="h-80">
            <Card>
              <CardHeader>
                <CardTitle>Evaluate</CardTitle>
                <CardDescription>
                  Evaluate Your Configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="space-y-1">
                  <Label className="text-lg">MongoDB Configuration</Label>
                  <p><strong>Host:</strong> {mongoHost}</p>
                  <p><strong>Port:</strong> {mongoPort}</p>
                  <p><strong>DB:</strong> {mongoDatabase}</p>
                  <p><strong>Username:</strong> {mongoUser}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-lg">PostgreSQL Configuration</Label>
                  <p><strong>Host:</strong> {rdbmsHost}</p>
                  <p><strong>Port:</strong> {rdbmsPort}</p>
                  <p><strong>DB:</strong> {rdbmsDatabase}</p>
                  <p><strong>Username:</strong> {rdbmsUser}</p>
                </div>
              </CardContent>
              <CardFooter>
                <div>
                  <Button onClick={() => {
                    handleSubmit("TransformSchema");
                    setShow((pre) => !pre);
                  }}>
                    Start Transformation
                  </Button>
                  <Spinner className="my-2" color='yellow' size="small" show={show}>
                    {loadingMessage.text && <div className={loadingMessage.success ? "text-green-600 text-sm font-semibold ml-2" : "text-yellow-500 text-sm font-semibold ml-2"}>{loadingMessage.text}</div>}
                  </Spinner>
                  {schemaMessage.text && <div className={schemaMessage.success ? "text-green-600 text-sm font-semibold my-2" : "text-red-500 text-sm font-semibold my-2"}>{schemaMessage.text}</div>}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
   
  );
}
